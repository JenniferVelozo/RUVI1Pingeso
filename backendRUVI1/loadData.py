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
    '''Esta funcion puebla con los datos basicos para el funcionamiento de la app. Solo debe
    ser utilizada en la instalacion de la misma o puede causar conflictos las FK en la BD'''
    
    #Define los roles.
    roles=['Jefe de servicio', 'UGP', 'Administrador']
    i=1
    for nombreRol in roles:
        rol = Roles.objects.get_or_create(id=i,nombre = nombreRol)[0]
        rol.save()
        i=i+1
    
    #Define los servicios.
    servicios=['Unidad de gestion de pacientes', 
    'Recuperación de Pabellón HPINO', 
    'UCI Adulto HPINO', 'UHT Medicina HPINO', 'Hospitalizacion Domiciliaria HPINO', 'Psiquiatría Hospital de Día HPINO', 
    'Area Medico Quirúrgica HPINO', 'UCI Neonatología HPINO', 'Pensionado HPINO', 
    'Neonatología Hospitalizado HPINO', 'Unidad de Cuidados Medios HPINO', 'Medicina Agudo HPINO', 
    'Psiquiatría Corta Estadía HPINO', 'Obstetricia y GO HPINO 2°Piso', 'Pediatría Indiferenciado HPINO', 
    'Hospitalizacion Urgencia Adulto HPINO', 'Obstetricia y Ginecologia 1°Piso', 'Recuperación Pabellón Oftalmologia HPINO', 'UTI Adultos HPINO', 'UTI Neonatología HPINO', 'Recuperación UCMA HPINO']
    i=1
    Servicio.objects.all().delete()
    for nombreservicio in servicios:
        servicio = Servicio.objects.get_or_create(id=i,nombre = nombreservicio)[0]
        servicio.save()
        i=i+1


    User.objects.all().delete()
    #Define los usuarios base.
    usuario = User.objects.create_user(nombre='Diego', apellido='Ruiz', 
            nickname='DRuiz', password="ugp1234", rut='11111111-1', servicio=Servicio.objects.get(nombre='Unidad de gestion de pacientes'), rol=Roles.objects.get(nombre='Administrador'))

    usuario2 = User.objects.create_user(nombre='Edgardo', apellido='Villavicencio', 
            nickname='EVillavicencio', password="ugp1234", rut='11111111-1', servicio=Servicio.objects.get(nombre='Unidad de gestion de pacientes'), rol=Roles.objects.get(nombre='Administrador'))

    

if __name__=='__main__':
    print("Iniciando poblacion de datos.")
    poblar()
    load_inicial()

