import os
from socket import setdefaulttimeout
import time


os.environ.setdefault("DJANGO_SETTINGS_MODULE","backendRUVI1.settings")
import django
from random import random

django.setup()


from gestionPacientes.models import *
from gestionPacientes.loadCSV import load_inicial
def poblar():
    #listas de permisos.
    #permiso de acceso 2 es para admin.
    permisosAcceso=['Permiso de acceso 1','Permiso de acceso 2']
    permisosGenerales=['Visualizacion de gestion', 'Edicion de pendientes', 
                        'Visualizacion de historicos']
    permisosUGP=['Modificacion BD', 'Visualizacion de reporte mensual', 'Carga de pacientes', 
                'Edicion de diagnosticos']
    permisosAdministrador=['Configuracion del sistema', 'Creacion de usuarios']
    permisos=permisosAcceso+permisosAdministrador+permisosUGP+permisosGenerales
    #Puebla la BD con los permisos.
    for nombrePermiso in permisos:
        permiso = Permisos.objects.get_or_create(nombre = nombrePermiso)[0]
        permiso.save()
    
    #Define y puebla con roles.
    roles=['Jefe de servicio', 'UGP', 'Administrador']
    i=1
    for nombreRol in roles:
        rol = Roles.objects.get_or_create(id=i,nombre = nombreRol)[0]
        rol.save()
        i=i+1
    
    #asigna los permisos al rol de jefe de servicio
    rolJefeS=Roles.objects.get(nombre='Jefe de servicio')
    permisosJefeS=permisosGenerales
    permisosJefeS.append(permisosAcceso[0])
    for nombrePermiso in permisosJefeS:
        rolJefeS.permisos.add(Permisos.objects.get(nombre=nombrePermiso))

    #asigna los permisos al rol UGP
    rolUGP=Roles.objects.get(nombre='UGP')
    permisosGestion=permisosGenerales + permisosUGP
    permisosGestion.append(permisosAcceso[0])
    for nombrePermiso in permisosGestion:
        rolUGP.permisos.add(Permisos.objects.get(nombre=nombrePermiso))

    #asigna los permisos al rol admin
    roladmin=Roles.objects.get(nombre='Administrador')
    permisosadmin=permisosGenerales + permisosUGP + permisosAdministrador
    permisosadmin.append(permisosAcceso[1])
    for nombrePermiso in permisosadmin:
        roladmin.permisos.add(Permisos.objects.get(nombre=nombrePermiso))

    #servicios
    servicios=['Unidad de gestion de pacientes', 
    'Recuperaci??n de Pabell??n HPINO', 
    'UCI Adulto HPINO', 'UHT Medicina HPINO', 'Hospitalizacion Domiciliaria HPINO', 'Psiquiatr??a Hospital de D??a HPINO', 
    'Area Medico Quir??rgica HPINO', 'UCI Neonatolog??a HPINO', 'Pensionado HPINO', 
    'Neonatolog??a Hospitalizado HPINO', 'Unidad de Cuidados Medios HPINO', 'Medicina Agudo HPINO', 
    'Psiquiatr??a Corta Estad??a HPINO', 'Obstetricia y GO HPINO 2??Piso', 'Pediatr??a Indiferenciado HPINO', 
    'Hospitalizacion Urgencia Adulto HPINO', 'Obstetricia y Ginecologia 1??Piso', 'Recuperaci??n Pabell??n Oftalmologia HPINO', 'UTI Adultos HPINO', 'UTI Neonatolog??a HPINO', 'Recuperaci??n UCMA HPINO']
    i=1
    Servicio.objects.all().delete()
    for nombreservicio in servicios:
        servicio = Servicio.objects.get_or_create(id=i,nombre = nombreservicio)[0]
        servicio.save()
        i=i+1
    User.objects.all().delete()
    #usuarios
    usuario = User.objects.create_user(nombre='Diego', apellido='Ruiz', 
            nickname='DRuiz', password="ugp1234", rut='11111111-1', servicio=Servicio.objects.get(nombre='Unidad de gestion de pacientes'), rol=Roles.objects.get(nombre='Administrador'))

    usuario2 = User.objects.create_user(nombre='Edgardo', apellido='Villavicencio', 
            nickname='EVillavicencio', password="ugp1234", rut='11111111-1', servicio=Servicio.objects.get(nombre='Unidad de gestion de pacientes'), rol=Roles.objects.get(nombre='Administrador'))

    

if __name__=='__main__':
    print("poblando")
    poblar()
    load_inicial()

