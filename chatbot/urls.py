from django.urls import path
from .views import repondre_question

urlpatterns = [
    path('ia/', repondre_question)
]
