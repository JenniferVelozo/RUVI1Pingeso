import os
import pandas as pd
from numpy import arange
from sqlalchemy import create_engine
import sqlalchemy as sqlalchemy
from gestionPacientes.dbConnection import conectar_db, close_session_db


def load_CIE10_GRD(archivo):
    conn = conectar_db()
    print(conn)
    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    listaID = arange(1,cie10.shape[0]+1,1).tolist()
    cie10 = cie10.assign(id=listaID)
    print(cie10)
    cie10.to_sql("cie10", con=conn, if_exists="replace", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.execute('ALTER TABLE cie10 ADD PRIMARY KEY (id);')

    norma = pd.read_excel(archivo, sheet_name='NORMA')
    listaID = arange(1,norma.shape[0]+1,1).tolist()
    norma = norma.assign(id=listaID)
    print(norma)
    norma.to_sql("norma", con=conn, if_exists="replace", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.execute('ALTER TABLE norma ADD PRIMARY KEY (id);')
    conn.dispose()
    close_session_db(conn)


def load_prestaciones(archivo):
    conn = conectar_db()
    prestaciones = pd.read_excel(archivo, sheet_name='Prestaciones')
    listaID = arange(1,prestaciones.shape[0]+1,1).tolist()
    prestaciones = prestaciones.assign(id=listaID)
    print(prestaciones)
    prestaciones.to_sql("pendiente", con=conn, if_exists="replace", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.execute('ALTER TABLE pendiente ADD PRIMARY KEY (id);')
    conn.dispose()
    close_session_db(conn)

def load_pacientes(archivo):
    conn = conectar_db()
    pacientes = pd.read_excel(archivo, sheet_name='NUEVO FORMATO BD')
    listaID = arange(1,pacientes.shape[0]+1,1).tolist()
    pacientes = pacientes.assign(id=listaID)
    print(pacientes)
    pacientes.to_sql("paciente", con=conn, if_exists="replace", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.execute('ALTER TABLE paciente ADD PRIMARY KEY (id);')
    conn.dispose()
    close_session_db(conn)
    return pacientes

def load_inicial():
    print("Aquí leemos los archivos CIE 10 y Norma y los almacenamos en la DB")
    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm'
    print(archivo)
    load_CIE10_GRD(archivo)
    

    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\PRESTACIONES_CAUSAS.xlsx'
    print(archivo)
    load_prestaciones(archivo)

    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\PACIENTES.xlsx'
    load_pacientes(archivo)


if __name__=='__main__':
    pacientes = load_inicial()
    
    


