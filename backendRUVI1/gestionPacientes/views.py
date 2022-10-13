
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.core import serializers
from gestionPacientes.models import *

from .serializers import *
from django.http import HttpResponse

# Create your views here.
@api_view(['POST'])
def comprobar(request):
    print(request.data)
    user=request.data
    data = Usuarios.objects.get(nickname=user['nickname'])
    if data.password==user['password']:
        #return HttpResponse(data, content_type='application/json')
        user=[{'entra': 'SI'}]
        return HttpResponse(user, content_type='application/json')
    user=[{'entra': 'NO'}]
    return HttpResponse(user, content_type='application/json')
    

class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuarios.objects.all()
    #print(queryset)

class ServicioViewSet(viewsets.ModelViewSet):
    serializer_class = ServicioSerializer
    queryset = Servicio.objects.all()

class RolViewSet(viewsets.ModelViewSet):
    serializer_class = RolSerializer
    queryset = Roles.objects.all()

class ResumenViewSet(viewsets.ModelViewSet):
    serializer_class = ResumenSerializer
    queryset = Resumen.objects.all()