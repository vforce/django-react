from django.urls import path
from .views import main, RoomView

urlpatterns = [path("room", RoomView.as_view())]
