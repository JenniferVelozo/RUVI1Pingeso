#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import pandas as pd
from sqlalchemy import create_engine

def conectar_db(username, password, host, port, database):
    conn = 'postgresql://'+ username +':'+ password + '@' + host +':'+ port+'/'+ database
    # 'postgresql://postgres:postgres@admin:5432/RUVI1'
    # Conexión a base de datos local
    engine = create_engine(conn)
    return engine

def main():
    print("Aquí leemos los archivos CIE 10 y Norma y los almacenamos en la DB")
    path = os.path.dirname(os.path.realpath(__file__))

    conn = conectar_db('postgres', 'admin', '127.0.0.1', '5432', 'RUVI1')
    print(conn)

    archivo = path+'\CIE10-GRD.xlsm'
    #print(archivo)

    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    print(cie10)
    cie10.to_sql("cie10", con=conn, if_exists="replace")

    norma = pd.read_excel(archivo, sheet_name='NORMA')
    print(norma)
    norma.to_sql("norma", con=conn, if_exists="replace")
    

    


    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backendRUVI1.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
    
