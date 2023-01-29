from django.db import models
import string
from uuid import uuid4


def generate_unique_code(length: int = 8) -> str:
    while True:
        code = str(uuid4())[:length].upper()
        if Room.objects.filter(code=code).count() == 0:
            return code


# Create your models here.
class Room(models.Model):
    # generate a unique room code each time room is created
    code = models.CharField(max_length=32, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
