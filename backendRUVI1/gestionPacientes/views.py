
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.core import serializers
from gestionPacientes.models import *
from gestionPacientes.df import *
from .serializers import *
from django.http import HttpResponse, JsonResponse
from openpyxl.utils.cell import get_column_interval
from openpyxl.styles import Font, PatternFill, Alignment
import openpyxl
import json
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
from gestionPacientes.loadCSV import *


class UploadFileForm(forms.Form):
    file = forms.FileField()


@api_view(['POST'])
def subir(request):
    respuesta={"Response": "Archivo cargado correctamente. 200_OK"}
    respuesta2={"Response": "Archivo no cargado. 400 BAD REQUEST"}
    respuesta3={"Response": "Archivo no cargado. El archivo no cumple el formato. BAD REQUEST"}
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            if handle_uploaded_file(request.FILES['file']):
                return JsonResponse(respuesta, safe=False, status=status.HTTP_200_OK)
            else:
                return JsonResponse(respuesta3, safe=False, status=status.HTTP_400_BAD_REQUEST)
    else:

        form = UploadFileForm()
    return JsonResponse(respuesta2, safe=False, status=status.HTTP_400_BAD_REQUEST)

  

def handle_uploaded_file(f):  
    path = os.path.dirname(os.path.realpath(__file__))
    path=path+'\\'
    print(path)
    path=path + f.name 
    with open(path, 'wb+') as destination:  
      for chunk in f.chunks():  
          destination.write(chunk)  
    print("------------------------------")
    print(f.name)
    if f.name=='PACIENTES.xlsx':
        print("pacientes")
        leerDf()
        return True
    '''
    if f.name=='CIE10-GRD.xlsm':
        print("cie10-norma")
        load_CIE10_GRD(path)
        return True
    if f.name=='PRESTACIONES_CAUSAS.xlsx':
        print("pendientes")
        load_prestaciones(path)
        return True'''
    return False
# Create your views here.
@api_view(['POST'])
def comprobar(request):
    print(request.data)
    user=request.data
    data = Usuarios.objects.get(nickname=user['nickname'])
    if data.password==user['password']:
        #return HttpResponse(data, content_type='application/json')
        user=[{'entra': 'SI', 'rol': data.rol.nombre}]
        return HttpResponse(user, content_type='application/json')
    user=[{'entra': 'NO'}]
    return HttpResponse(user, content_type='application/json')
    
@api_view(['POST'])
def setPendientes(request):
    print(request.data)
    data=request.data
    idPendientes=data["pendientes"]
    idRes=data["id"]
    pJson=[]
    for idP in idPendientes:
        r=Resumen.objects.get(id=idRes)
        p=Pendientes.objects.get(id=idP)
        h = Historico.objects.get(id = idRes)
        pJson.append({'id': idP, 'nombre': p.nombrePendiente, 'causa':p.causa })
        r.pendientes.add(p)
        h.pendientes.add(p)
    fecha = datetime.now()
    r.flag_pend=True
    r.updated_at=fecha
    h.flag_pend = True
    r.pendientesJson=pJson
    h.pendientesJson=pJson
    print(type(h.pendientesJson))
    r.save()
    h.save()
    #print(r.nombrePaciente)
    #print(r.pendientes.all())
    #print(r.flag_pend)
    #print(r.pendientesJson)
    return HttpResponse(data, content_type='application/json')

def HistoricotoDictionary(historico):
    if historico == None:
        return None
    
    aux={}
    aux["id"]=historico.id
    aux["rut"]= historico.rut
    aux["nombrePaciente"]= historico.nombrePaciente
    aux["servicio_id"]=historico.servicio.id
    aux["nombreServicio"]=historico.nombreServicio
    aux["cama"] = historico.cama
    aux["estancia"] = int(historico.estancia) 
    aux["criterio"]=float(historico.criterio)
    aux["diagnostico1"]= historico.diagnostico1
    aux["diagnostico1Cod"]=historico.diagnostico1Cod
    aux["diagnostico2"]= historico.diagnostico2
    aux["diagnostico2Cod"]=historico.diagnostico2Cod
    aux["ir_grd"] = historico.ir_grd
    aux["emNorma"]= float(historico.emNorma)
    aux["pcSuperior"]= int(historico.pcSuperior)
    aux["pesoGRD"] = float(historico.pesoGRD)
    aux["flag_diag"]=historico.flag_diag
    aux["flag_pend"]=historico.flag_pend
    aux["pendientesJson"]=historico.pendientesJson

    #print(aux)
    return aux

@api_view(['GET'])
def filtrarServicioPendiente(request, fecha, nombreServicio, nombrePendiente):
    
    historico = Historico.objects.all()
    
    #print(type(historico))
    #print(historico)

    historico = list(historico)
    # Primero filtramos por fecha
    porFecha = []
    #print(type(historico[0]))
    for e in historico:
        
        #print("MOSTRANDO FECHA: ", type(fecha))
        #print(type(e.fecha))
        if str(e.fecha) == fecha:
            #print("entra")
            porFecha.append(e)
    
    #print(porFecha)
    #print(type(porFecha[0].fecha))
    porServicio = []
    for e in porFecha:
        #print(e.servicio.id)
        if e.servicio.nombre == nombreServicio:
            porServicio.append(e)
    
    #print("Mostrando filtrado por servicio")
    #print(porServicio)
    #print(porServicio[0])

    porPendiente = []
    for e in porServicio:
        #print(e.pendientesJson)
        if e.pendientesJson!=0:
            for i in e.pendientesJson:
                if i['nombre'] == nombrePendiente:
                    #print("entra")
                    #print(i['id'])
                    porPendiente.append(e)


   
    #print("Mostrando id_servicio: ", id_servicio)

    listaFinal = []
    for resumen in porPendiente:
        #print(resumen)
        listaFinal.append(HistoricotoDictionary(resumen))
    
    if nombrePendiente == "":
        print("entra")
        listaPorServicio = []
        for resumen in porServicio:
            #print(resumen)
            listaPorServicio.append(HistoricotoDictionary(resumen))
            return JsonResponse(listaPorServicio, safe=False, json_dumps_params={'ensure_ascii':False})
    #print(listaFinal)
    return JsonResponse(listaFinal, safe=False, json_dumps_params={'ensure_ascii':False})


@api_view(['GET'])
def filtrarServicio(request, fecha, nombreServicio):
    
    historico = Historico.objects.all()
    
    #print(type(historico))
    #print(historico)

    historico = list(historico)
    print(historico)
    # Primero filtramos por fecha
    porFecha = []
    #print(type(historico[0]))
    for e in historico:
        
        #print("MOSTRANDO FECHA: ", type(fecha))
        #print(type(e.fecha))
        if str(e.fecha) == fecha:
            #print("entra")
            porFecha.append(e)
    
    #print(porFecha)
    #print(type(porFecha[0].fecha))
    porServicio = []
    for e in porFecha:
        #print(e.servicio.id)
        if nombreServicio=="todos":
            porServicio.append(e)
        else:   
            if e.servicio.nombre == nombreServicio:
                porServicio.append(e)
    
    #print("Mostrando filtrado por servicio")
    #print(porServicio)
    #print(porServicio[0])

    listaFinal = []
    for resumen in porServicio:
        #print(resumen)
        listaFinal.append(HistoricotoDictionary(resumen))

    #print(listaFinal)
    print(listaFinal)
    return JsonResponse(listaFinal, safe=False, json_dumps_params={'ensure_ascii':False})

@api_view(['GET'])
def filtrarPendientesPorPaciente(request, id_paciente):
    resumen = Resumen.objects.get(id=int(id_paciente))
    print(resumen.pendientesJson)
    print(resumen)
    return JsonResponse(resumen.pendientesJson, safe=False, json_dumps_params={'ensure_ascii':False})


@api_view(['GET'])
def reporteMensual(request, year, mes):
    
    mensual=ReporteMensual.objects.filter(fecha__year=year, fecha__month=mes)

    lista=[]
    for m in mensual:
        mJson={}
        mJson["id"]=m.id
        mJson["fecha"]=m.fecha
        mJson["servicioNombre"]=m.servicioNombre
        mJson["servicioId"]=m.servicio.id
        mJson["em"]=m.em
        mJson["emaf"]=m.emaf
        mJson["iema"]=m.iema
        mJson["peso"]=m.peso
        mJson["iemaInliersMenor"]=m.iemainliersMenor
        mJson["iemaInliersMayor"]=m.iemainliersMayor
        mJson["outliers"]=m.outliers
        mJson["pInt"]=m.pInt
        mJson["pExt"]=m.pExt
        mJson["condP"]=m.condP
        lista.append(mJson)
    return JsonResponse(lista, safe=False,  json_dumps_params={'ensure_ascii':False})

@api_view(['POST'])
def deleteUser(request):
    print(request.data)
    data=request.data
    idUser = data["id"]
    User.objects.filter(id=idUser).delete()
    return HttpResponse("ok", content_type='application/json')

@api_view(['POST'])
def setDiagnostico(request):
    data=request.data
    print(data)
    diagnostico1Cod=data["principal"]
    diagnostico2=data["secundarios"]
    idPaciente=data["id"]
    dias_estada=data["dias"]
    diag2_final = ""

    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm'
    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    norma = pd.read_excel(archivo, sheet_name='NORMA')
    #print(pd.to_numeric(norma["IR-GRD CÓDIGO v2.3"], downcast='integer'))
    # Se tranforma a numérico entero el IR GRD ya que lo toma con un .0 al final
    norma["IR-GRD CÓDIGO v2.3"] = pd.to_numeric(norma["IR-GRD CÓDIGO v2.3"], downcast='integer')
    print(norma["IR-GRD CÓDIGO v2.3"])


    nombres_diags2 = []
    diagnostico2Cod=diagnostico2
    diagnostico2Json=[]
    if str(diagnostico2) == 'nan':
        diagnostico2 = []
        diagnostico2Cod=NULL
    else:
        diagnostico2 = str(diagnostico2).split(',')
        for diag in diagnostico2:
            condicion_diag2 = cie10.loc[:, 'CODIGO'] == diag
            diagnostico2_pd = cie10.loc[condicion_diag2]

            grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
            sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
            nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
            aux={}
            if grd_diagnostico2.size != 0:
                print("AAAAAAAAAAAAAAAAAAAAAAAAA")
                diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico2['GRD'].values[0])
                sev = str(sev_diagnostico2['SEV'].values[0])
                aux['codigo']=str(diag)
                aux['nombre']=str(diagnostico_dos)
                
                diagnostico2Json.append(aux)
            else:
                print("No tiene GRD")
                print("GRD CONFLICTO...")
                condicion = cie10.loc[:, 'CODIGO'] == diag+'.0'
                print(diag)
                diagnostico2_pd = cie10.loc[condicion]
                grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
                sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
                nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico2['GRD'].values[0])
                sev = str(sev_diagnostico2['SEV'].values[0])
                aux['codigo']=str(diag)
                aux['nombre']=str(nombre_diagnostico2)
                
                diagnostico2Json.append(aux)


            nombres_diags2.append(diagnostico_dos)
            diag2_final=""
            for i in range(len(nombres_diags2)-1):
                print("1  ",diag2_final)
                diag2_final = diag2_final + nombres_diags2[i] +", "
                print(diag2_final)
            diag2_final = diag2_final + nombres_diags2[len(nombres_diags2)-1]
    print("Diagnóstico 2: ", diagnostico2)
    print("Nombres diag2: ", nombres_diags2)
    
    
    if str(diagnostico1Cod) != 'nan':
        # Aquí busca el código del diagnóstico en el CIE10
        condicion = cie10.loc[:, 'CODIGO'] == diagnostico1Cod
        diagnostico1_pd = cie10.loc[condicion]

        grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
        sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
        nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
        if grd_diagnostico1.size != 0:
            diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
            grd = str(grd_diagnostico1['GRD'].values[0])
            sev = str(sev_diagnostico1['SEV'].values[0])
            
        else:
            print("No tiene GRD")
            print("GRD CONFLICTO...")
            condicion = cie10.loc[:, 'CODIGO'] == diagnostico1Cod+'.0'
            diagnostico1_pd = cie10.loc[condicion]
            grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
            sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
            nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
            diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
            grd = str(grd_diagnostico1['GRD'].values[0])
            sev = str(sev_diagnostico1['SEV'].values[0])
    else:
        diagnostico_uno = ""
        grd = ""
        sev = ""
        diagnostico1Cod=NULL

    print("DIAGNÓSTICO 1: ", diagnostico_uno)
    print("GRD ANTES: ", grd)
    print("SEV ANTES: ", sev)

    # El GRD y SEV quedan como decimal por lo que se quita 
    # lo que está después del '.'
    if '.' in grd:
        i = grd.find('.')
        print(i)
        grd = grd[0:i]

    if '.' in sev:
        i2 = sev.find('.')
        sev = sev[0:i2]

    # Si la severidad es 0 o N entonces se añade un 1 al GRD
    if sev == '0' or sev == 'N':
        codigo_norma = str(grd)+'1'
    # Si la severidad es CC entonces se añade un 2 al GRD
    elif sev == 'CC':
        codigo_norma = str(grd)+'2'
    # Si la severidad es MCC entonces se añade un 3 al GRD
    elif sev == 'MCC':
        codigo_norma = str(grd)+'3'
    # Sino se añade un 1 al GRD
    else:
        codigo_norma = str(grd)+'1'

    print("GRD DESPUÉS: ", grd)
    print("SEV DESPUÉS: ", sev)
    print("El código norma es: ", codigo_norma)
    print("El largo código norma es: ", len(codigo_norma))

    # Ahora se busca el código IR-GRD en la norma
    norma["IR-GRD CÓDIGO v2.3"]=norma["IR-GRD CÓDIGO v2.3"].apply(str)
    # print(norma.loc[:,'IR-GRD CÓDIGO v2.3'])
    # print(type(norma.loc[:,'IR-GRD CÓDIGO v2.3']))
    condicion2 = norma.loc[:,'IR-GRD CÓDIGO v2.3'] == codigo_norma
    # print("condicion 2: ",condicion2)
    fila_norma = norma.loc[condicion2]
    # print(fila_norma)
    #print(fila_norma)
    pc_corte = 0
    peso_grd = 0
    em_norma = 0
    if fila_norma.size == 0:
        print("No tiene NORMA")
    else:
        print("TIENE NORMA -------------------------------------------------------------------------")
        pc_corte = fila_norma['PC superior'].values[0]
        peso_grd = fila_norma['Peso GRD'].values[0]
        em_norma = fila_norma['EM \n(inlier)'].values[0]
        
    criterio = NULL
    if pc_corte!=0:
        criterio=float(dias_estada)/float(pc_corte)
        
    print(" El puntaje de corte es: ",pc_corte)
    print(" El peso grd es : ", peso_grd)
    print(" El EM es: ", em_norma)
    print(" El grd es: ", grd)
    print("codigo diag princ: ",diagnostico1Cod)
    print("diag principal: ", diagnostico_uno)
    print("codigo diag sec: ",diagnostico2Cod)
    print("diag secundarios: ",diag2_final)
    print("id paciente",idPaciente)
    print("Dias de estada: ", dias_estada)
    print("Valor criterio: ", criterio)
    fecha = datetime.now()
    paciente=Resumen.objects.get(id=idPaciente)
    paciente.pcSuperior=pc_corte
    paciente.pesoGRD=peso_grd
    paciente.emNorma=em_norma
    paciente.ir_grd=grd
    paciente.diagnostico1Cod=diagnostico1Cod
    paciente.diagnostico1=diagnostico_uno
    paciente.diagnostico2Cod=diagnostico2Cod
    paciente.diagnostico2=diag2_final
    paciente.diagnostico2Json=diagnostico2Json
    paciente.estancia=dias_estada
    paciente.criterio=criterio
    paciente.flag_diag=True
    paciente.updated_at=fecha
    paciente.save()
    return HttpResponse(data, content_type='application/json')
   


# establece el tamaño de las celdas y los colores para que no se sobrepongan
def estiloExcel(nombre):
    informe = openpyxl.load_workbook(nombre)

    sheet = informe.active 

    def set_width_to(sheet, start, stop, width):
        for col in get_column_interval(start, stop):
            sheet.column_dimensions[col].width = width

    set_width_to(sheet, "A", "A", width=5)
    set_width_to(sheet, "B", "B", width=14)
    set_width_to(sheet, "C", "C", width=52)
    set_width_to(sheet, "D", "D", width=10)
    set_width_to(sheet, "E", "E", width=9)
    set_width_to(sheet, "F", "F", width=84)
    set_width_to(sheet, "G", "G", width=18)
    set_width_to(sheet, "H", "H", width=84)
    set_width_to(sheet, "I", "I", width=27)
    set_width_to(sheet, "J", "M", width=10)
    set_width_to(sheet, "N", "N", width=40)
    set_width_to(sheet, "O", "R", width=10)
    set_width_to(sheet, "S", "S", width=50)

    encabezados=["A1","B1","C1","D1","E1","F1","G1","H1","I1","J1","K1","L1","M1","N1","O1","P1","Q1","R1","S1"]
    for encabezado in encabezados:
        celda = sheet[encabezado]
        celda.fill =  PatternFill("solid", fgColor="D9D9D9")
    informe.save(nombre)

@api_view(['GET'])
def linkDescarga(request):
    nombreArchivo='Gestion_de_Pacientes.xlsx'
    nombreArchivoR='\Gestion_de_Pacientes.xlsx'
    ruta=os.path.dirname(os.path.abspath(__file__)) + nombreArchivoR
    with open(ruta,'rb') as fh:
        response = HttpResponse(fh.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="%s"' % nombreArchivo
    return response

@api_view(['GET'])
def usuariosG(request):
    users=User.objects.all()
    lista=[]
    for user in users:
        aux={}
        aux['id']=user.id
        aux["nombre_servicio"]=user.servicio.nombre
        aux["nombre_rol"]=user.rol.nombre
        aux["nombre"]= user.nombre
        aux["apellido"]= user.apellido
        aux["nickname"]= user.nickname
        aux["rut"]= user.rut
        lista.append(aux)
    return JsonResponse(lista, safe=False, json_dumps_params={'ensure_ascii':False})

@api_view(['POST'])   
def resumen_to_excel(request):
    print(request)
    resumenJSON=request.data
    cama=[]
    rut=[]
    nombrePaciente=[] 
    estancia=[] 
    criterio=[] 
    diagnostico1=[] 
    diagnostico2 =[]
    diagnostico1Cod=[] 
    diagnostico2Cod =[]
    ir_grd=[] 
    emNorma=[] 
    pcSuperior=[] 
    pesoGRD=[] 
    nombreServicio=[] 
    servicio=[] 
    flag_diag =[]
    flag_pend=[]
    pendientesJson=[]
    for paciente in resumenJSON:
        cama.append(paciente['cama']) 
        rut.append(paciente['rut']) 
        nombrePaciente.append(paciente['nombrePaciente']) 
        estancia.append(paciente['estancia']) 
        criterio.append(paciente['criterio']) 
        diagnostico1.append(paciente['diagnostico1'])
        diagnostico1Cod.append(paciente['diagnostico1Cod'])  
        diagnostico2.append(paciente['diagnostico2'])
        diagnostico2Cod.append(paciente['diagnostico2Cod'])
        ir_grd.append(paciente['ir_grd']) 
        emNorma.append(paciente['emNorma']) 
        pcSuperior.append(paciente['pcSuperior']) 
        pesoGRD.append(paciente['pesoGRD']) 
        nombreServicio.append(paciente['nombreServicio']) 
        servicio.append(paciente['servicio']) 
        flag_diag.append(paciente['flag_diag'])
        flag_pend.append(paciente["flag_pend"])
        pendientesJson.append(paciente["pendientesJson"])

    resumen= pd.DataFrame()
    resumen=resumen.assign(rut=rut, nombrePaciente=nombrePaciente, cama=cama, estancia=estancia,
    diagnostico1=diagnostico1, diagnostico1Cod=diagnostico1Cod, diagnostico2=diagnostico2, diagnostico2Cod=diagnostico2Cod, ir_grd=ir_grd, emNorma=emNorma, 
    pcSuperior=pcSuperior, pesoGRD=pesoGRD, nombreServicio=nombreServicio, servicio=servicio, criterio=criterio, flag_diag=flag_diag,
    flag_pend=flag_pend,pendientesJson=pendientesJson)
    

    nombreArchivo='gestionPacientes\Gestion_de_Pacientes.xlsx'
    
    print(resumen)
    resumen.to_excel(nombreArchivo, sheet_name='Resumen de pacientes')
    estiloExcel(nombreArchivo)
    resp={}
    resp["msg"]="Creado correctamente"
    return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii':False})


class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    #print(queryset)

class ServicioViewSet(viewsets.ModelViewSet):
    serializer_class = ServicioSerializer
    queryset = Servicio.objects.all()

class RolViewSet(viewsets.ModelViewSet):
    serializer_class = RolSerializer
    queryset = Roles.objects.all()

class PendienteViewSet(viewsets.ModelViewSet):
    serializer_class = PendienteSerializer
    queryset = Pendientes.objects.all()

# --- INTENTO DE FILTRO ---
from django_filters.rest_framework import DjangoFilterBackend
class ResumenViewSet(viewsets.ModelViewSet):
    '''serializer_class = ResumenSerializer
    queryset = Resumen.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields=['=servicio__id']'''
    queryset = Resumen.objects.all().order_by('-updated_at')#.values()
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
    #rol_id = serializer.data.get('rol__id')
    usuario=User.objects.get(nickname=nickname)
    rol_id=usuario.rol_id
    servicio_id=usuario.servicio_id
    rol=Roles.objects.get(id=rol_id)
    rol=rol.nombre
    servicio=Servicio.objects.get(id=servicio_id)
    servicio=servicio.nombre
    user = authenticate(nickname=nickname, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success', 'rol':rol,'servicio':servicio,'servicio_id':servicio_id}, status=status.HTTP_200_OK)
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