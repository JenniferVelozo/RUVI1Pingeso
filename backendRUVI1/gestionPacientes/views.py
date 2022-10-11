from django.shortcuts import render
from rest_framework import viewsets
from django.core import serializers
from gestionPacientes.models import Usuarios

from .serializers import UsuarioSerializer
from django.http import HttpResponse

# Create your views here.
def usuarios(request):
    data = Usuarios.objects.all()
    #print(data)

    data1 = serializers.serialize('json', data)
    print(data1)


    return HttpResponse(data1, content_type='application/json')


class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuarios.objects.all()
    print(queryset)
