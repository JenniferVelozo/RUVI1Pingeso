from asyncio.windows_events import NULL
from cmath import nan
import json
import os

import pandas as pd
from gestionPacientes.models import *
#from backendRUVI1.gestionPacientes.models import Servicio

from gestionPacientes.models import Resumen, Pacientes


def prueba(archivo):
    pacientes= pd.read_excel(archivo, sheet_name='DEFINITIVO')
    print(pacientes)