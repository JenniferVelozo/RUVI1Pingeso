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
    for nombreRol in roles:
        rol = Roles.objects.get_or_create(nombre = nombreRol)[0]
        rol.save()
    
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
    servicios=['Unidad de gestion de pacientes']
    for nombreservicio in servicios:
        servicio = Servicio.objects.get_or_create(nombre = nombreservicio)[0]
        servicio.save()

    #usuarios
    usuario = Usuarios.objects.get_or_create(nombre='Jennifer', apellido='Velozo', 
            nickname='JVelozo', password='1234', rut='20433980-5')[0]
    usuario.servicio=Servicio.objects.get(nombre='Unidad de gestion de pacientes')
    usuario.rol=Roles.objects.get(nombre='Administrador')
    usuario.save()

if __name__=='__main__':
    print("poblando")
    poblar()
    pacientes = load_inicial()
    #print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    #for i in range(len(pacientes)):
    #    print(pacientes.iloc[i]['DiagnosticosEpisodio'])

