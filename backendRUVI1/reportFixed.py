
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","backendRUVI1.settings")
import django

django.setup()

from gestionPacientes.df import *
from gestionPacientes.repMensual import *

if __name__=='__main__':
    print("Main ")
    # Este codigo solo se debe ejecutar una vez, se creo para arreglar un error a la fecha 18/02/2023
    # los reportes mensuales tienen la fecha diferida en 1 mes (mala desicion de diseño), esto arregla 
    # los reportes ya creados y cambios ya realizados en df.py y reMensual.py lo arreglan para futuros reportes.
    # NO VOLVER A EJECUTAR LUEGO DE SU PRIMER USO.
    reductor()
    