from django.urls import path
from .views import main, RoomView

urlpatterns = [
    path('home', RoomView.as_view())
]
