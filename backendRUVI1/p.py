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

#ESTE ARCHIVO ES PARA PROBAR CODIGO 
def prueba(idPendientes):
    pJson=[]
    for idP in idPendientes:
        r=Resumen.objects.get(id=275)
        p=Pendientes.objects.get(id=idP)
        pJson.append({'id': idP, 'nombre': p.nombrePendiente, 'causa':p.causa })
        r.pendientes.add(p)
    r.flag_pend=True
    r.pendientesJson=pJson
    
    r.save()
    #print(r.nombrePaciente)
    #print(r.pendientes.all())
    #print(r.flag_pend)
    #print(r.pendientesJson)
    

if __name__=='__main__':
    prueba([1,2,3])