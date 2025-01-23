# api/urls.py
from django.urls import path
from .views import GenerateContentView

urlpatterns = [
    path("generate/", GenerateContentView.as_view(), name="generate_content"),
]