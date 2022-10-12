from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class ResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resumen
        fields = '__all__'