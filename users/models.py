from djongo import models
from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, role='patient', **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, role='admin', **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(username, email, password, role=role, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)  # ✅ Ajout explicite
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('medecin', 'Médecin'),
        ('admin', 'Admin'),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"

class Ville(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-incrémenté
    nom = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nom
    
class Specialite(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-incrémenté
    nom = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nom



class Etablissement(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nom

class Medecin(models.Model):
    TITRE_PRO = [
    ('Docteur', 'Docteur'),
    ('Assistant', 'Assistant'),
    ('Maître-assistant', 'Maître-assistant'),
    ('Maître de conférences', 'Maître de conférences'),
    ('Professeur', 'Professeur'),
    ('Chef de service', 'Chef de service'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profil_medecin'
    )
    nom = models.CharField(max_length=100, default='')
    prenom = models.CharField(max_length=100, default='')
    numero_telephone = models.CharField(max_length=20, default='')
    adresse = models.CharField(max_length=255, blank=True, null=True)
    debut_carriere = models.DateField(null=True, blank=True, default=None)
    prix_consultation = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name='ville_medecin')
    genre = models.CharField(max_length=255, default='')
    date_naissance = models.DateField(null=True, blank=True, default=None)
    etablissement = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name='etablissement_medecin')
    titre_professionnel = models.CharField(max_length=255, choices=TITRE_PRO, default='Docteur')    
    specialite = models.ForeignKey(Specialite, on_delete=models.CASCADE, related_name='specialite_medecin')
    photo = models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"{self.prenom} {self.nom}"

class Disponibilite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    jour = models.CharField(max_length=10)  # lundi, mardi, etc.
    matin_debut = models.TimeField(null=True, blank=True)
    matin_fin = models.TimeField(null=True, blank=True)
    apresmidi_debut = models.TimeField(null=True, blank=True)
    apresmidi_fin = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.jour}"

class Conge(models.Model):
    id_conge = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='conges')
    start_date = models.DateField(default='2000-01-01')
    start_period = models.CharField(max_length=20, choices=[('matin', 'Matin'), ('apres-midi', 'Après-midi')], default='matin')
    end_date = models.DateField(default='2000-01-01')
    end_period = models.CharField(max_length=20, choices=[('matin', 'Matin'), ('apres-midi', 'Après-midi')], default='apres-midi')
    motif = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Congé {self.id_conge}"
    
class Patient(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profil_patient'
    )
    nom = models.CharField(max_length=100, default='')
    prenom = models.CharField(max_length=100, default='')
    numero_telephone = models.CharField(max_length=20, default='')
    adresse = models.CharField(max_length=255, blank=True, null=True)
    date_naissance = models.DateField(null=True, blank=True, default=None)
    groupe_sanguin = models.CharField(max_length=10, blank=True, null=True)
    ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name='ville_patient')
    genre = models.CharField(max_length=255, default='')
    photo = models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"{self.prenom} {self.nom}"
    
class RendezVous(models.Model):
    TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('contrôle', 'Contrôle'),
    ]

    MODE_CHOICES = [
        ('présentiel', 'Présentiel'),
        ('à distance', 'À distance'),
    ]

    STATUT_CHOICES = [
        ('en attente', 'En attente'),
        ('confirmé', 'Confirmé'),
        ('annulé', 'Annulé'),
        ('terminé', 'Terminé'),
    ]
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rdvs_patient')
    medecin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rdvs_medecin')
    
    date = models.DateField()
    heure = models.TimeField()
    
    type_consultation = models.CharField(max_length=20, choices=TYPE_CHOICES, default='consultation')
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='presentiel')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en attente')

    commentaire = models.TextField(blank=True, null=True)  # facultatif
    lien_visio = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    evaluation = models.PositiveSmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"RDV {self.patient.username} avec Dr {self.medecin.username} le {self.date} à {self.heure}"

# class Message(models.Model):
#     id = models.AutoField(primary_key=True)
#     expediteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_envoyes')
#     destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_recus')
#     objet = models.CharField(max_length=255)
#     contenu = models.TextField()
#     date_envoi = models.DateTimeField(auto_now_add=True)
#     lu = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.objet} de {self.expediteur.email} à {self.destinataire.email}"

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    expediteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_envoyes')
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_recus')
    objet = models.CharField(max_length=255)
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    pieces_jointe = models.FileField(upload_to='pieces_jointes/', null=True, blank=True)  # ✅ Pièce jointe facultative

    def __str__(self):
        return f"{self.objet} de {self.expediteur.email} à {self.destinataire.email}"
    


class Notification(models.Model):
    id_notif = models.AutoField(primary_key=True)

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notification')
    message = models.TextField()
    date_envoi = models.DateTimeField()
    lu = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification pour {self.utilisateur.email}"