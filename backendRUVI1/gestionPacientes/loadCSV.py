
import os
import pandas as pd
from numpy import arange
from sqlalchemy import create_engine
import sqlalchemy as sqlalchemy


from gestionPacientes.models import *
from gestionPacientes.dbConnection import conectar_db, close_session_db
from datetime import date

def load_CIE10_GRD(archivo):
    conn = conectar_db()
    print(conn)
    cie10Bruto = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    listaID = arange(1,cie10Bruto.shape[0]+1,1).tolist()
    cie10=pd.DataFrame()
    cie10=cie10.assign(#id=listaID,
                        codigo=cie10Bruto["CODIGO"],
                        diagnostico=cie10Bruto["DIAGNOSTICO"],
                        sev=cie10Bruto["SEV"],
                        grd=cie10Bruto["GRD"])
    print(cie10)
    cie10.to_sql("cie10", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    #conn.execute('ALTER TABLE cie10 ADD PRIMARY KEY (id);')

    normaBruta = pd.read_excel(archivo, sheet_name='NORMA')
    norma=pd.DataFrame()
    norma= norma.assign(#id=listaID,
                        ir_grd = normaBruta['IR-GRD CÓDIGO v2.3'],
                        nombreGRD= normaBruta['NOMBRE GRUPO GRD'],
                        emInlier = normaBruta['EM \n(inlier)'],
                        pcSuperior = normaBruta['PC superior'],
                        pesoGRD = normaBruta['Peso GRD'])
    print(norma)
    norma.to_sql("norma", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    #conn.execute('ALTER TABLE norma ADD PRIMARY KEY (id);')
    conn.dispose()
    #close_session_db(conn)


def load_prestaciones(archivo):
    conn = conectar_db()
    prestaciones = pd.read_excel(archivo, sheet_name='Prestaciones')
   # prestaciones = prestaciones.assign(id=listaID)
    print(prestaciones)
    prestaciones=prestaciones.rename(columns={"PRESTACIONES": "nombrePendiente",
                                                "CAUSAS": "causa"})
    prestaciones.to_sql("pendiente", con=conn, if_exists="append", index=False, dtype={'id': sqlalchemy.types.BigInteger()})
    #conn.execute('ALTER TABLE pendiente ADD PRIMARY KEY (id);')
    conn.dispose()
    #close_session_db(conn)

def load_pacientes(archivo):
    conn = conectar_db()
    pacientesBruto = pd.read_excel(archivo, sheet_name='DEFINITIVO')
    pacientes=pd.DataFrame()
    fecha= date.today()
    pacientes= pacientes.assign(rut = pacientesBruto['RUNPaciente'],
                        nombre = pacientesBruto['NombrePaciente'],
                        apellidoPaterno = pacientesBruto['ApellidoPaterno'],
                        apellidoMaterno = pacientesBruto['ApellidoMaterno'],
                        fechaCarga = str(fecha.year)+'/'+str(fecha.month)+'/'+str(fecha.day),
                        ultimaCama = pacientesBruto['UltimaCama'],
                        diasEstancia = pacientesBruto['DíasEstada'],
                        nombreServicio= pacientesBruto['UltimoServicioClínico_Desc'], 
                        fechaIngreso = pacientesBruto['FechaEpisodio'],
                        diagnosticoPricipal= pacientesBruto['DiagnosticoPrincipal'],
                        diagnosticoSecundario= pacientesBruto['ListaDiagnosticosEpisodio'])
    
    print(pacientes)
    id_servicios=[]
    for i in range(len(pacientes)):
        s=pacientes.iloc[i]['nombreServicio']
        if s!= NULL:
            servicio=Servicio.objects.get(nombre=s)
            id_servicios.append(servicio.id)
        else:
            id_servicios.append(NULL)

    pacientes=pacientes.assign(servicio_id=id_servicios)
    pacientes=pacientes.drop(['nombreServicio'], axis=1)
    pacientes.to_sql("paciente", con=conn, if_exists="append", index=False)


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
    
    


