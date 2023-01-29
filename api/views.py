from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .models import Room
from .serializers import CreateRoomSerializer, RoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
def main(request):
    return HttpResponse("<h1>hello</h1>")


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        print("request data = ", request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = int(serializer.data.get("votes_to_skip"))
            host = self.request.session.session_key
            print(f"host = {host}")
            query_set = Room.objects.filter(host=host)
            if query_set.exists():
                room = query_set.first()
                print(f"room exists, existing room = {room}")
                room.guest_can_pause = guest_can_pause
                print(f"guest can pause = {guest_can_pause}")
                room.votes_to_skip = room.votes_to_skip
                print(f"votes to skip = {votes_to_skip}")
                # room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                query_set.update(
                    guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip
                )
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                print("creating a new room")
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()
                return Response(
                    RoomSerializer(room).data, status=status.HTTP_201_CREATED
                )
        return Response(status=status.HTTP_400_BAD_REQUEST)
