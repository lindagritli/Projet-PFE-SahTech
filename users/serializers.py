from rest_framework import serializers
from .models import User, Patient, Medecin, RendezVous, Disponibilite, Conge, Etablissement, Message, Ville, Specialite

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active']        

class MedecinSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    ville_nom = serializers.CharField(source='ville.nom', read_only=True)
    specialite_nom = serializers.CharField(source='specialite.nom', read_only=True)
    etablissement_nom = serializers.CharField(source='etablissement.nom', read_only=True)

    class Meta:
        model = Medecin
        fields = '__all__'

    def get_email(self, obj):
        return obj.user.email if obj.user else None

class RendezVousSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
        fields = '__all__'

class CongeSerializer(serializers.ModelSerializer):
    id_conge = serializers.UUIDField(read_only=True) 

    class Meta:
        model = Conge
        fields = '__all__'

class DisponibiliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disponibilite
        fields = '__all__'

# class PatientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Patient
#         fields = '__all__'
    
#     def get_email(self, obj):
#         return obj.user.email if obj.user else None

class PatientSerializer(serializers.ModelSerializer):
    ville = serializers.PrimaryKeyRelatedField(queryset=Ville.objects.all())
    ville_nom = serializers.CharField(source='ville.nom', read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

    def get_email(self, obj):
        return obj.user.email if obj.user else None

class EtablissementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etablissement
        fields = '__all__'

class SpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialite
        fields = '__all__'

class VilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ville
        fields = '__all__'
        
class MessageSerializer(serializers.ModelSerializer):
    expediteur = UserSerializer(read_only=True)
    destinataire = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'