
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.core import serializers
from gestionPacientes.models import *
from gestionPacientes.df import *
from .serializers import *
from django.http import HttpResponse, JsonResponse

from rest_framework import filters
from rest_framework import status, mixins, generics, viewsets

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from gestionPacientes.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from gestionPacientes.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import os
from django import forms


class UploadFileForm(forms.Form):
    file = forms.FileField()


@api_view(['POST'])
def subir(request):
    form = UploadFileForm(request.POST, request.FILES)
    respuesta={"Response": "Archivo cargado correctamente. 204"}
    respuesta2={"Response": "Archivo no cargado. 404"}
    if form.is_valid():
            handle_uploaded_file(request.FILES['file'])
            return JsonResponse(respuesta, safe=False, status=status.HTTP_200_OK)
    return JsonResponse(respuesta2, safe=False, status=status.HTTP_200_OK)


def handle_uploaded_file(f):  
    path = os.path.dirname(os.path.realpath(__file__))
    path=path+'\\'
    print(path)
    with open(path + f.name , 'wb+') as destination:  
      for chunk in f.chunks():  
          destination.write(chunk)  
    
    leerDf()

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

# --- INTENTO DE FILTRO ---
from django_filters.rest_framework import DjangoFilterBackend
class ResumenViewSet(viewsets.ModelViewSet):
    '''serializer_class = ResumenSerializer
    queryset = Resumen.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields=['=servicio__id']'''
    queryset = Resumen.objects.all()
    serializer_class = ResumenSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['servicio__id', 'rut']


class HistoricoViewSet(viewsets.ModelViewSet):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['fecha']

class HistoricoDatesViewSet(viewsets.ModelViewSet):
    queryset = Historico.objects.values('fecha', 'id')
    serializer_class = HistoricoDatesSerializer

  


    

#----------------INTENTO DE LOGIN --------------------

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    nickname = serializer.data.get('nickname')
    password = serializer.data.get('password')
    user = authenticate(nickname=nickname, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Nickname o password inválida']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)


class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)