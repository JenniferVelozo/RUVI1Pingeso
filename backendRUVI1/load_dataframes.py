
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","backendRUVI1.settings")
import django

django.setup()

from gestionPacientes.df import *


if __name__=='__main__':
    leerDf()
    