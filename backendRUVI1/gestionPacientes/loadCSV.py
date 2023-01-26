
import os
import pandas as pd
from numpy import arange
from sqlalchemy import create_engine
import sqlalchemy as sqlalchemy


from gestionPacientes.models import *
from gestionPacientes.dbConnection import conectar_db, close_session_db
from datetime import date

def load_CIE10_GRD(archivo):
    '''Funcion que transcribe el archivo de CIE10 Y NORMA a la BD, tiene por entrada el nombre del archivo'''
    conn = conectar_db()
    cie10Bruto = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    listaID = arange(1,cie10Bruto.shape[0]+1,1).tolist()
    # Se crea una dataframe para contener los datos del excel.
    cie10=pd.DataFrame()
    cie10=cie10.assign(id=listaID,
                        codigo=cie10Bruto["CODIGO"],
                        diagnostico=cie10Bruto["DIAGNOSTICO"],
                        sev=cie10Bruto["SEV"],
                        grd=cie10Bruto["GRD"])
    print(cie10)

    #Se repite para el cie10.
    Cie10.objects.all().delete()
    cie10.to_sql("cie10", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    normaBruta = pd.read_excel(archivo, sheet_name='NORMA')
    listaID = arange(1,normaBruta.shape[0]+1,1).tolist()
    norma=pd.DataFrame()    
    norma= norma.assign(id=listaID,
                        ir_grd = normaBruta['IR-GRD CÓDIGO v2.3'],
                        nombreGRD= normaBruta['NOMBRE GRUPO GRD'],
                        emInlier = normaBruta['EM \n(inlier)'],
                        pcSuperior = normaBruta['PC superior'],
                        pesoGRD = normaBruta['Peso GRD'])
    print(norma)
    Norma.objects.all().delete()
    norma.to_sql("norma", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.dispose()



def load_prestaciones(archivo):
    '''Funcion que transcribe el archivo de prestaciones a la BD, tiene por entrada el nombre del archivo'''
    conn = conectar_db()
    Pendientes.objects.all().delete()
    prestaciones = pd.read_excel(archivo, sheet_name='Prestaciones')
    listaID = arange(1,prestaciones.shape[0]+1,1).tolist()
    prestaciones = prestaciones.assign(id=listaID)
    print(prestaciones)
    prestaciones=prestaciones.rename(columns={"PRESTACIONES": "nombrePendiente",
                                                "CAUSAS": "causa"})
    prestaciones.to_sql("pendiente", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    conn.dispose()


def load_inicial():
    '''Funcion encapsuladora que realiza el llamado a las funciones que leen los archivos base. A la par de la 
    lectura se transcriben los datos a la BD. Esta funcion se debe ejecutar solo una vez durante el proceso de instalacion'''
    
    print("Inicio de la lectura de los archivos CIE 10 y Norma, se almacenan en la BD.")
    #busca los archivos en la carpeta actual.
    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm' 
    print(archivo)
    load_CIE10_GRD(archivo)
    

    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\PRESTACIONES_CAUSAS.xlsx'
    print(archivo)
    load_prestaciones(archivo)

    


if __name__=='__main__':
    pacientes = load_inicial()
    
    


