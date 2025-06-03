# chatbot/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def repondre_question(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question = data.get('question', '').lower()

        # Logique simple (tu peux l’améliorer ou utiliser un vrai modèle)
        if "tête" in question:
            reponse = "Vous devriez consulter un neurologue."
        elif "peau" in question or "boutons" in question:
            reponse = "Vous devriez consulter un dermatologue."
        elif "cœur" in question or "essoufflement" in question:
            reponse = "Vous devriez consulter un cardiologue."
        elif "dent" in question or "appareil" in question:
            reponse = "Vous devriez consulter un dentiste."
        else:
            reponse = "Je vous conseille de voir un médecin généraliste pour un premier diagnostic."

        return JsonResponse({'reponse': reponse})


@csrf_exempt
def ia_chat(request):
    if request.method == "POST":
        data = json.loads(request.body)
        question = data.get("question", "").lower()

        if "peau" in question or "bouton" in question:
            reponse = "Vous pouvez consulter un Dermatologue."
        elif "coeur" in question or "palpitation" in question:
            reponse = "Il est recommandé de voir un Cardiologue."
        else:
            reponse = "Merci pour votre question, nous allons l'analyser."

        return JsonResponse({"reponse": reponse})
