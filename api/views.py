from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .models import Room
from .serializers import CreateRoomSerializer, RoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

SESSION_KEY_ROOM_KEY = "room_code"

# Create your views here.
def main(request):
    return HttpResponse("<h1>hello</h1>")


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwargs = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwargs)
        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
                )
        return Response(
            {"error": "Room code was not found"}, status=status.HTTP_400_BAD_REQUEST
        )


class JoinRoomView(APIView):
    lookup_url_kwargs = "code"

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwargs)
        if code is not None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                # set the current room code for the current user
                self.request.session[SESSION_KEY_ROOM_KEY] = code
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"error": "Room code is required"}, status=status.HTTP_400_BAD_REQUEST
        )


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
                self.request.session[SESSION_KEY_ROOM_KEY] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                print("creating a new room")
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()
                self.request.session[SESSION_KEY_ROOM_KEY] = room.code
                return Response(
                    RoomSerializer(room).data, status=status.HTTP_201_CREATED
                )
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserInRoomView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {"code": self.request.session.get(SESSION_KEY_ROOM_KEY)}
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoomView(APIView):
    def post(self, request, format=None):
        if SESSION_KEY_ROOM_KEY in self.request.session:
            # remove code from user session
            code = self.request.session.pop(SESSION_KEY_ROOM_KEY)
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                print(f"delete room code {code}")
                room.delete()
            print(f"leave room code {code}")
        return Response({"message": "success"}, status=status.HTTP_200_OK)
