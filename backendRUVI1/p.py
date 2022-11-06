from asyncio.windows_events import NULL
from cmath import nan
import json
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","backendRUVI1.settings")
import django
from random import random

django.setup()
import pandas as pd
from gestionPacientes.models import *
#from backendRUVI1.gestionPacientes.models import Servicio

def prueba():
    roles=Roles.objects.get(id=3)
    print(roles.nombre)
    print(roles.permisos.all())

if __name__=='__main__':
    prueba()