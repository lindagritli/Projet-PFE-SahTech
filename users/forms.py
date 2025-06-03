from django import forms
from .models import User
from django.contrib.auth.hashers import make_password

class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput, label="Confirmer le mot de passe")

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'role']

    def clean(self):
        cleaned_data = super().clean()
        pwd = cleaned_data.get("password")
        confirm = cleaned_data.get("confirm_password")
        if pwd and confirm and pwd != confirm:
            raise forms.ValidationError("Les mots de passe ne correspondent pas.")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user
