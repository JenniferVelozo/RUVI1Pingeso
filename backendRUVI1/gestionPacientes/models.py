from django.db import models

# Create your models here.

class Usuarios(models.Model):
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    nickname = models.CharField(max_length = 20)
    password = models.CharField(max_length = 20)

class Roles(models.Model):
    nombre = models.CharField(max_length = 20)

