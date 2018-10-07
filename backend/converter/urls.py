from django.urls import path

from converter.views import ConverterAPIView

urlpatterns = [
    path('', ConverterAPIView.as_view()),
]
