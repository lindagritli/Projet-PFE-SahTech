from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import User, Medecin, Patient, Disponibilite, Conge, Etablissement, Ville, RendezVous, Message, Specialite
from .serializers import (PatientSerializer, DisponibiliteSerializer, CongeSerializer, SpecialiteSerializer,
                          UserSerializer, MedecinSerializer, EtablissementSerializer, 
                          RendezVousSerializer, MessageSerializer, VilleSerializer)
from bson import ObjectId
from pymongo import MongoClient
import json
from rest_framework import status
import uuid
from .calendar_utils import *
from datetime import timedelta, time
from django.utils import timezone
import requests
from django.db.models import Avg

URL_MONGO_CLIENT = 'mongodb://localhost:27017/'
DB_NAME = 'sahtech_db'
TABLE_MEDECIN = 'users_medecin'
TABLE_CONGE = 'users_conge'

# ✅ INSCRIPTION
@csrf_exempt
def signup_api(request):
    if request.method == "POST":
        # try:
            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            role = data.get("role", "patient")
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Nom d'utilisateur existe déjà"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email existe déjà"}, status=400)
            
            hashed_password = make_password(password)
            
            # Définir is_active=False pour les médecins
            is_active = False if role == "medecin" else True
            
            user = User.objects.create(
                username=username, 
                email=email, 
                password=hashed_password, 
                role=role,
                is_active=is_active
            )

            if role == "medecin":
                Medecin.objects.create(user=user)
            elif role == "patient":
                Patient.objects.create(user=user)

            return JsonResponse({"message": "Utilisateur créé avec succès"}, status=201)
# except Exception as e:
#     return JsonResponse({"error": str(e)}, status=500)

# @csrf_exempt
# def signup_api(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             username = data.get("username")
#             email = data.get("email")
#             password = data.get("password")
#             role = data.get("role", "patient")

#             if User.objects.filter(username=username).exists():
#                 return JsonResponse({"error": "Nom d'utilisateur existe déjà"}, status=400)

#             if User.objects.filter(email=email).exists():
#                 return JsonResponse({"error": "Email existe déjà"}, status=400)

#             hashed_password = make_password(password)
#             user = User(username=username, email=email, password=hashed_password, role=role)
#             user.save()

#             #✅ Créer profil par défaut selon le rôle
#             if role == "medecin":
#                 Medecin.objects.create(user=user)
#             elif role == "patient":
#                 Patient.objects.create(user=user)  # <-- ✅ création automatique

#             return JsonResponse({"message": "Utilisateur créé avec succès"}, status=201)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)


# ✅ LOGIN
@csrf_exempt
def login_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            user = User.objects.filter(email=email).first()
            if user and check_password(password, user.password):
                return JsonResponse({
                    "message": "Connexion réussie",
                    "email": user.email,
                    "username": user.username,
                    "role": user.role,
                    "is_active": user.is_active
                }, status=200)

            return JsonResponse({"error": user.password}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# ✅ GET USER BY USERNAME
@api_view(['GET'])
def get_user_by_name(request, username):
    user = get_object_or_404(User, username=username)
    return Response({
        "username": user.username,
        "email": user.email,
        "role": user.role
    })

@api_view(['GET'])
def get_user_nom_prenom(request, user_id_param):
    try:
        #Vérifier d'abord si c'est un patient
        patient = Patient.objects.filter(user_id=user_id_param).first()
        if patient:
            # patient = Patient.objects.select_related('user').get(user_id=user_id) # ne marche pas
            # patient = PatientSerializer(Patient.objects.filter(user_id=user_id)) # ne marche pas
            patient = get_object_or_404(Patient, user_id=user_id_param)
            serializer_patient = PatientSerializer(patient)
            return Response({
                "nom": serializer_patient.data.get('nom').upper(),
                "prenom": serializer_patient.data.get('prenom'),
                "role": "patient"
            })

        #Sinon, vérifier si c'est un médecin
        medecin = Medecin.objects.filter(user_id=user_id_param).first()
        if medecin:
            medecin = get_object_or_404(Medecin, user_id=user_id_param)
            serializer_medecin = PatientSerializer(medecin)
            return Response({
                "nom": serializer_medecin.data.get('nom').upper(),
                "prenom": serializer_medecin.data.get('prenom'),
                "role": "medecin"
            })

        else:
            return Response({"error": "Aucun patient ou médecin trouvé avec cet ID."}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
###############################################
#------------------ MEDECIN ------------------#
###############################################

# ✅ GET ALL MEDECINS
@api_view(['GET'])
def get_all_medecins(request):
    medecins = Medecin.objects.all()
    serializer = MedecinSerializer(medecins, many=True)
    return Response(serializer.data)


# ✅ GET ONE MEDECIN PAR EMAIL
@api_view(['GET'])
def get_medecin_by_email(request, email):
    try:
        medecin = Medecin.objects.select_related('user').get(user__email=email)
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin introuvable'}, status=404)

    serializer = MedecinSerializer(medecin)
    return Response(serializer.data)


# # ✅ CREATE NOUVEAU MEDECIN (lié à un utilisateur existant)
# @api_view(['POST'])
# def create_medecin(request):
#     try:
#         email = request.data.get("email")
#         user = get_object_or_404(User, email=email)

#         if hasattr(user, 'profil_medecin'):
#             return Response({"error": "Médecin déjà existant"}, status=400)

#         medecin = Medecin(user=user)
#         serializer = MedecinSerializer(medecin, data=request.data)

#         if serializer.is_valid():
#             serializer.save(user=user)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

#     except Exception as e:
#         return Response({"error": str(e)}, status=500)
    

# @api_view(['PUT'])
# def update_medecin(request, email):
#     try:
#         # Connecte-toi directement à MongoDB
#         client = MongoClient(URL_MONGO_CLIENT)  # Change selon ton URL de connexion
#         db = client[DB_NAME]  # Remplace par le nom exact de ta base
#         collection = db[TABLE_MEDECIN]

#         # Récupérer l'utilisateur par email
#         user = User.objects.filter(email=email).first()
#         if not user:
#             return Response({'error': 'Utilisateur introuvable'}, status=404)

#         # Construire les champs à mettre à jour
#         update_data = {}
#         data = request.data
#         update_data['nom'] = data.get('nom', None)
#         update_data['prenom'] = data.get('prenom', None)
#         update_data['numero_telephone'] = data.get('numero_telephone', None)
#         update_data['specialite'] = data.get('specialite', None)
#         update_data['adresse'] = data.get('adresse', None)
#         update_data['debut_carriere'] = data.get('debut_carriere', None)
#         update_data['prix_consultation'] = data.get('prix_consultation', None)
#         # Nettoyage des champs inutiles (None)
#         update_data = {k: v for k, v in update_data.items() if v is not None}

#         # Mise à jour via Pymongo
#         result = collection.update_one(
#             {'user_id': user.id},  # Identifiant unique du médecin
#             {'$set': update_data}  # Mise à jour des champs spécifiés
#         )

#         if result.matched_count == 0:
#             return Response({'error': 'Médecin introuvable'}, status=404)

#         return Response({'message': 'Les informations du médecin ont été mises à jour avec succès'}, status=200)
#     except Exception as e:
#         import traceback
#         print("❌ ERREUR:", traceback.format_exc())
#         return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def create_medecin(request):
    try:
        email = request.data.get("email")
        user = get_object_or_404(User, email=email)

        if hasattr(user, 'profil_medecin'):
            return Response({"error": "Médecin déjà existant"}, status=400)

        # Passer l'user dans le serializer, pas besoin d'instancier Medecin à la main
        data = request.data.copy()
        data['user'] = user.id  # Fournir l'ID du user

        serializer = MedecinSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['PUT'])
def update_medecin(request, email):
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'Utilisateur introuvable'}, status=404)

        medecin = Medecin.objects.filter(user=user).first()
        if not medecin:
            return Response({'error': 'Médecin introuvable'}, status=404)

        serializer = MedecinSerializer(medecin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Les informations du médecin ont été mises à jour avec succès'})
        else:
            return Response(serializer.errors, status=400)

    except Exception as e:
        import traceback
        print("❌ ERREUR:", traceback.format_exc())
        return Response({'error': str(e)}, status=500)

#test 
@api_view(['GET'])
def test_api(request):
    email = request.data.get('email')
    
    try :
        user = get_object_or_404(User, email=email)
        serializer_user = UserSerializer(user)
        current_id = serializer_user.data.get("id")
    except :
        return Response({'error': "not found"}, status=404)
    #medecin = Medecin.objects.select_related('user').get(user__email=email)
    
    conge = Conge.objects.filter(user_id=current_id)
    serializer_conges = CongeSerializer(conge, many=True)
    return Response({'conges': serializer_conges.data})

#####################################################
#------------------ DISPONIBILITE ------------------#
#####################################################

# Disponibilité 
#  Enregistrer ou mettre à jour toutes les disponibilités + congés
@api_view(['GET'])
def get_medecin_disponibilite(request, email):

    try :
        user = get_object_or_404(User, email=email)
        serializer_user = UserSerializer(user)
        current_id = serializer_user.data.get("id")
    except :
        return Response({'error': "not found"}, status=404)
        
    dispo = Disponibilite.objects.filter(user_id=current_id)
    serializer_dispo = DisponibiliteSerializer(dispo, many=True)
    return Response({'disponibilite': serializer_dispo.data})

from django.utils.dateparse import parse_time

@api_view(['PUT'])
def update_medecin_dispo_overwrite_mode(request, email):
    horaires = request.data.get('horaires')
    try:
        user = get_object_or_404(User, email=email)
    except:
        return Response({'error': "not found"}, status=404)

    # 🔄 Supprimer les anciennes dispos
    Disponibilite.objects.filter(user=user).delete()

    # 🕒 Ajouter les nouvelles dispos
    for jour, bloc in horaires.items():
        def safe_time(val):
            return parse_time(val) if val else None

        Disponibilite.objects.create(
            user=user,
            jour=jour,
            matin_debut=safe_time(bloc['matin']['debut']) if bloc['matin']['active'] else None,
            matin_fin=safe_time(bloc['matin']['fin']) if bloc['matin']['active'] else None,
            apresmidi_debut=safe_time(bloc['apresMidi']['debut']) if bloc['apresMidi']['active'] else None,
            apresmidi_fin=safe_time(bloc['apresMidi']['fin']) if bloc['apresMidi']['active'] else None,
        )

    return Response({"message": "✅ Disponibilités médecin mises à jour"})


#############################################
#------------------ CONGE ------------------#
#############################################

@api_view(['GET'])
def get_conges_medecin_by_email(request, email):
    try:
        medecin = Medecin.objects.select_related('user').get(user__email=email)
        user_id = medecin.user.id
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin introuvable'}, status=404)
    
    conges = Conge.objects.filter(user=user_id)
    if len(conges) == 0:
        return Response([])

    try:
        serializer = CongeSerializer(conges, many=True)
    except:
        return Response({'error': 'Congés KO'})
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_conge(request):
    try:
        email = request.data.get('email')
        medecin = Medecin.objects.select_related('user').get(user__email=email)
        user_id = medecin.user.id

        conge = Conge.objects.create(
            user_id=user_id,
            start_date=request.data.get('start_date'),
            start_period=request.data.get('start_period'),
            end_date=request.data.get('end_date'),
            end_period=request.data.get('end_period'),
            motif=request.data.get('motif', '')
        )
        return Response({'message': 'Congé ajouté avec succès'}, status=201)

    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin introuvable'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
def modifier_conge(request, id):
    try:
        conge = Conge.objects.get(pk=id)  # ✅ chercher par id_conge
        conge.start_date = request.data.get('start_date', conge.start_date)
        conge.start_period = request.data.get('start_period', conge.start_period)
        conge.end_date = request.data.get('end_date', conge.end_date)
        conge.end_period = request.data.get('end_period', conge.end_period)
        conge.motif = request.data.get('motif', conge.motif)
        conge.save()

        serializer = CongeSerializer(conge)
        return Response(serializer.data)

    except Conge.DoesNotExist:
        return Response({'error': 'Congé introuvable'}, status=404)
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return Response({'error': str(e)}, status=500)


@api_view(['DELETE'])
def supprimer_conge(request, id):
    try:
        conge = Conge.objects.get(pk=id)  # ✅ chercher par id_conge
        conge.delete()
        return Response({'message': 'Congé supprimé avec succès'}, status=200)

    except Conge.DoesNotExist:
        return Response({'error': 'Congé introuvable'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

###############################################
#------------------ PATIENT ------------------#
###############################################

# ✅ GET ONE PATIENT PAR EMAIL
# ✅ GET ONE PATIENT PAR EMAIL
@api_view(['GET'])
def get_patient_by_email(request, email):
    try:
        patient = Patient.objects.select_related('user').get(user__email=email)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient introuvable'}, status=404)

    serializer = PatientSerializer(patient)
    return Response(serializer.data)


# ✅ CREATE NOUVEAU PATIENT (lié à un utilisateur existant)
# ✅ CREATE NOUVEAU PATIENT (corrigé)
# @api_view(['POST'])
# def create_patient(request):
#     try:
#         email = request.data.get("email")
#         user = get_object_or_404(User, email=email)

#         if hasattr(user, 'profil_patient'):
#             return Response({"error": "Patient déjà existant"}, status=400)

#         patient = Patient(user=user, email=email)
#         serializer = PatientSerializer(patient, data=request.data)

#         if serializer.is_valid():
#             serializer.save(user=user)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

#     except Exception as e:
#         return Response({"error": str(e)}, status=500)



# @api_view(['PUT'])
# def update_patient(request, email):
#     try:
#         user = User.objects.filter(email=email).first()
#         if not user:
#             return Response({'error': 'Utilisateur introuvable'}, status=404)

#         patient = Patient.objects.filter(user=user).first()
#         if not patient:
#             return Response({'error': 'Patient introuvable'}, status=404)

#         data = request.data
#         fields = ['nom', 'prenom', 'numero_telephone', 
#                   'adresse', 'date_naissance', 'groupe_sanguin', 
#                   'email', 'ville', 'genre'
#                 ]

#         for field in fields:
#             value = data.get(field, None)
#             if value is not None:
#                 setattr(patient, field, value)

#         patient.save()
#         return Response({'message': 'Les informations du patient ont été mises à jour avec succès'}, status=200)

#     except Exception as e:
#         import traceback
#         print("❌ ERREUR:", traceback.format_exc())
#         return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def create_patient(request):
    try:
        email = request.data.get("email")
        user = get_object_or_404(User, email=email)

        if hasattr(user, 'profil_patient'):
            return Response({"error": "Patient déjà existant"}, status=400)

        # Récupération de l'ID de la ville
        ville_id = request.data.get("ville")
        if not ville_id:
            return Response({"error": "Le champ 'ville' est requis"}, status=400)

        try:
            ville_instance = Ville.objects.get(id=ville_id)
        except Ville.DoesNotExist:
            return Response({"error": "Ville non trouvée"}, status=404)

        # Créer le patient avec ville
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, ville=ville_instance)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PUT'])
def update_patient(request, email):
    try:
        user = get_object_or_404(User, email=email)
        patient = getattr(user, 'profil_patient', None)

        if not patient:
            return Response({'error': 'Patient introuvable'}, status=404)

        data = request.data.copy()

        # Traiter la ville si fournie
        ville_id = data.get("ville")
        if ville_id:
            try:
                ville_instance = Ville.objects.get(id=ville_id)
                data["ville"] = ville_instance.id  # Préparer la donnée pour le serializer
            except Ville.DoesNotExist:
                return Response({'error': 'Ville invalide'}, status=400)

        serializer = PatientSerializer(patient, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '✔️ Profil patient mis à jour avec succès'}, status=200)
        return Response(serializer.errors, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

############################################
#------------------ USER ------------------#
############################################

# ✅ LISTE DE TOUS LES UTILISATEURS
@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# ✅ SUPPRIMER UN UTILISATEUR PAR ID
@api_view(['DELETE'])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({"message": "Utilisateur supprimé"}, status=204)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=404)

# ✅ MODIFIER UN UTILISATEUR PAR ID
@api_view(['PUT'])
def update_user(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


#####################################################
#------------------ ETABLISSEMENT ------------------#
#####################################################

@api_view(['GET'])
def liste_etablissements(request):
    etablissements = Etablissement.objects.all()
    serializer = EtablissementSerializer(etablissements, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_etablissement(request):
    serializer = EtablissementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def modifier_etablissement(request, id):
    etablissement = Etablissement.objects.get(id=id)
    serializer = EtablissementSerializer(etablissement, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def supprimer_etablissement(request, id):
    etablissement = Etablissement.objects.get(id=id)
    etablissement.delete()
    return Response({"message": "Supprimé ✅"})

##################################################
#------------------ SPECIALITE ------------------#
##################################################

@api_view(['GET'])
def liste_specialites(request):
    specialites = Specialite.objects.all()
    serializer = SpecialiteSerializer(specialites, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_specialite(request):
    is_many = isinstance(request.data, list)
    serializer = SpecialiteSerializer(data=request.data, many=is_many)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def modifier_specialite(request, id):
    specialite = Specialite.objects.get(id=id)
    serializer = SpecialiteSerializer(specialite, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def supprimer_specialite(request, id):
    specialite = Specialite.objects.get(id=id)
    specialite.delete()
    return Response({"message": "Supprimé ✅"})

#############################################
#------------------ Ville ------------------#
#############################################

@api_view(['GET'])
def liste_villes(request):
    villes = Ville.objects.all()
    serializer = VilleSerializer(villes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_ville(request):
    serializer = VilleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def modifier_ville(request, id):
    ville = Ville.objects.get(id=id)
    serializer = VilleSerializer(ville, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def supprimer_ville(request, id):
    ville = Ville.objects.get(id=id)
    ville.delete()
    return Response({"message": "Supprimé ✅"})

###################################################
#------------------ RENDEZ-VOUS ------------------#
###################################################


@api_view(['POST'])
def create_rendezvous(request):
    try:
        data = request.data
        patient_email = data.get('patient_email')
        medecin_email = data.get('medecin_email')
        date_str = data.get('date')
        heure_str = data.get('heure')
        mode = data.get('mode')
        type_consultation = data.get('type_consultation')

        patient = get_object_or_404(User, email=patient_email)
        medecin = get_object_or_404(User, email=medecin_email)

        # Génère le lien uniquement si à distance
        #lien_visio = None
        #if mode == "à distance": # au début c'était seulement pour à distance puis pour plus de flexibilité (modifié par le medecin) 
        
        # Génère le lien visio
        lien_visio = generate_jitsi_link(medecin_email, patient_email)

        rendezvous = RendezVous.objects.create(
            patient=patient,
            medecin=medecin,
            date=date_str,
            heure=heure_str,
            type_consultation=type_consultation,
            mode=mode,
            statut='en attente',
            commentaire='',
            lien_visio=lien_visio,
            evaluation=None,
        )

        return Response({'message': 'Rendez-vous confirmé', 
                         'mode': mode,
                         'lien_visio': lien_visio}, status=201)

    except Exception as e:
        import traceback
        print("Erreur backend:\n", traceback.format_exc())
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def lister_rendezvous(request):
    rdv = RendezVous.objects.all().order_by('-date')
    serializer = RendezVousSerializer(rdv, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def supprimer_rendezvous(request, id):
    rdv = get_object_or_404(RendezVous, id=id)
    rdv.delete()
    return Response({'message': 'Rendez-vous supprimé'})

@api_view(['PUT'])
def modifier_rendezvous(request, id):
    rdv = get_object_or_404(RendezVous, id=id)
    serializer = RendezVousSerializer(rdv, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Rendez-vous mis à jour'})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_rendezvous_patient(request, email):
    patient = Patient.objects.select_related('user').get(user__email=email)
    patient_id = patient.user.id
    rdvs = RendezVous.objects.filter(patient=patient_id).order_by('-date')
    serializer = RendezVousSerializer(rdvs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def annuler_rendezvous(request, id):
    try:
        rdv = get_object_or_404(RendezVous, id=id)

        if rdv.statut in ['fait', 'terminé', 'annulé']:
            return Response({'error': 'Ce rendez-vous ne peut plus être annulé.'}, status=400)

        motif = request.data.get("motif_annulation", "").strip()

        if not motif:
            return Response({'error': 'Le motif d’annulation est requis.'}, status=400)

        rdv.statut = "annulé"
        rdv.commentaire = f"Annulé par patient : {motif}"
        rdv.save()

        return Response({'message': 'Rendez-vous annulé avec succès.'})

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_rendezvous_medecin(request, email):
    medecin = Medecin.objects.select_related('user').get(user__email=email)
    medecin_id = medecin.user.id
    rdvs = RendezVous.objects.filter(medecin=medecin_id).order_by('-date')
    serializer = RendezVousSerializer(rdvs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def noter_experience(request, pk):
    try:
        rdv = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({"error": "Rendez-vous introuvable."}, status=404)

    evaluation = request.data.get('evaluation')

    if evaluation is None or not (1 <= int(evaluation) <= 5):
        return Response({"error": "Évaluation invalide (doit être entre 1 et 5)."}, status=400)

    rdv.evaluation = int(evaluation)
    rdv.save()

    return Response({"message": "Évaluation enregistrée avec succès."}, status=200)

################################################
#------------------ Messages ------------------#
################################################

# @api_view(['POST'])
# def envoyer_message(request):
#     serializer = MessageSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['GET'])
# def boite_reception(request, email):
#     messages = Message.objects.filter(destinataire__email=email).order_by('-date_envoi')
#     serializer = MessageSerializer(messages, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def boite_reception(request, email):
#     messages = Message.objects.filter(destinataire__email=email).order_by('-date_envoi')
#     serializer = MessageSerializer(messages, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def messages_envoyes(request, email):
#     messages = Message.objects.filter(expediteur__email=email).order_by('-date_envoi')
#     serializer = MessageSerializer(messages, many=True)
#     return Response(serializer.data)

# @api_view(['PUT'])
# def marquer_comme_lu(request, id):
#     try:
#         message = Message.objects.get(id=id)
#         message.lu = True
#         message.save()
#         return Response({"message": "Marqué comme lu"}, status=200)
#     except Message.DoesNotExist:
#         return Response({"error": "Message non trouvé"}, status=404)


@api_view(['POST'])
def envoyer_message(request):
    try:
        expediteur = User.objects.get(email=request.data.get('expediteur'))
        destinataire = User.objects.get(email=request.data.get('destinataire'))

        message = Message.objects.create(
            expediteur=expediteur,
            destinataire=destinataire,
            objet=request.data.get('objet'),
            contenu=request.data.get('contenu')
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=201)

    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=404)


@api_view(['GET'])
def boite_reception(request, email):
    messages = Message.objects.filter(destinataire__email=email).order_by('-date_envoi')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)



################################################
#----- Notification Rappel RDV ----------------#
################################################

@api_view(['GET'])
def rappels_rdv(request, email):
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    hour_now = timezone.now().time()

    rdvs = RendezVous.objects.filter(
        patient__email=email,
        date=tomorrow,
        statut='confirmé'
    )

    rappels = []
    for rdv in rdvs:
        # Test simple pour vérifier le fonctionnement de base
        if hour_now >= time(9, 0):  # pour tester maintenant
            rappels.append({
                'message': f"⏰ Vous avez un rendez-vous demain à {rdv.date} à {rdv.heure}."
            })

    return Response(rappels)


################################################
#------------ GEMINI Chatbot ------------------#
################################################

API_KEY = "AIzaSyB7voUAqO0kvBaFOTP-n8TopDrERhk2E0Y"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY}"

BASE_PROMPT = """
Tu es un assistant médical intelligent et professionnel. Tu aides les patients à :
- Comprendre leurs symptômes
- Trouver la spécialité médicale appropriée
- Répondre à leurs questions de santé

Tes réponses doivent être obligatoirement:
- Professionnelles
- Courtes (résumées), simples et compréhensibles
- Répondre de manière brève, claire et utile
- Concises et efficaces
- Sans donner de diagnostic direct
- Encourager à consulter un médecin en cas de doute
- Les prochaines étapes simples à suivre, et un ou deux conseils maximum.
- Lorsque les utilisateurs décrivent leurs symptômes, donnez uniquement les causes possibles principales
- Toujours recommander de consulter un professionnel de santé

Voici la question du patient :
"""

@csrf_exempt
def assistant_medical(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "").strip()

            if not user_message:
                return JsonResponse({"error": "Message manquant"}, status=400)

            # Construire prompt complet
            prompt = f"{BASE_PROMPT.strip()} {user_message}"

            payload = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ]
            }

            response = requests.post(GEMINI_URL, json=payload)
            response.raise_for_status()
            result = response.json()

            # Extraire la réponse du modèle
            reply = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

            return JsonResponse({"reply": reply})

        except Exception as e:
            return JsonResponse({"error": f"Erreur de traitement : {str(e)}"}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

@csrf_exempt
def reset_chat_view(request):
    if request.method == 'POST':
        try:
            request.session.pop("chat_history", None)
            return JsonResponse({"status": "Historique réinitialisé"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

@api_view(['GET'])
def get_medecin_evaluations(request, user_id):
    try:
        # Récupérer tous les rendez-vous du médecin qui ont une évaluation
        rdvs = RendezVous.objects.filter(
            medecin_id=user_id,
            evaluation__isnull=False
        )
        
        # Calculer la moyenne des évaluations
        moyenne = rdvs.aggregate(Avg('evaluation'))['evaluation__avg']
        
        # Compter le nombre d'évaluations
        nombre = rdvs.count()
        
        return Response({
            'moyenne': round(moyenne, 1) if moyenne else 0,
            'nombre': nombre
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
