from asyncio.windows_events import NULL
from cmath import nan
import os
import pandas as pd

path = os.path.dirname(os.path.realpath(__file__))
archivo = path+'\CIE10-GRD.xlsm'
cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')

norma = pd.read_excel(archivo, sheet_name='NORMA')


archivo = path+'\PRESTACIONES_CAUSAS.xlsx'

archivo = path+'\PACIENTES.xlsx'
pacientes= pd.read_excel(archivo, sheet_name='NUEVO FORMATO BD')

# Se recorre el dataframe de los pacientes
for i in range(len(pacientes)):
    diagnosticos = pacientes.iloc[i]['DiagnosticosEpisodio']  
    print("\n MOSTRANDO PACIENTE: ", pacientes.iloc[i]['RUNPaciente'])
    if str(diagnosticos) != 'nan':
        diagnosticos = diagnosticos.split(',')
        diagnostico1 = diagnosticos[0]
        diagnostico2 = diagnosticos[1:len(diagnosticos)]
        
        #print(diagnostico1)
        #print(cie10.where(cie10['CODIGO'] == diagnostico1))


        condicion = cie10.loc[:, 'CODIGO'] == diagnostico1
        diagnostico1_pd = cie10.loc[condicion]
        grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
        sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')

        nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')

        if grd_diagnostico1.size != 0:
            print("DIAGNÓSTICO: ",nombre_diagnostico1['DIAGNOSTICO'].values[0])
            print("GRD: ", grd_diagnostico1['GRD'].values[0])
            print("SEV: ", sev_diagnostico1['SEV'].values[0])

        else:
            print("No tiene GRD")
            print("GRD CONFLICTO...")
            condicion = cie10.loc[:, 'CODIGO'] == diagnostico1+'.0'
            diagnostico1_pd = cie10.loc[condicion]
            grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
            sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
            nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
            print("DIAGNÓSTICO: ", nombre_diagnostico1['DIAGNOSTICO'].values[0])
            print("GRD: ", grd_diagnostico1['GRD'].values[0])
            print("SEV: ", sev_diagnostico1['SEV'].values[0])

        
        #print("SEV: ", sev_diagnostico1['SEV'])

        #print (diagnostico1_pd.to_frame(name='NOMBRE'))

        '''
        nombre_diagnostico1 = cie10.where(cie10['CODIGO'] == diagnostico1)
        nombres_diagnostico2 = []
        for e in diagnostico2:
            x = cie10.where(cie10['CODIGO'] == e)
            nombres_diagnostico2.append(x)
        
        print("DIAGNÓSTICO 1: ", nombre_diagnostico1)
        print("DIAGNOSTICO 2: ", nombres_diagnostico2)'''

    else:
        # Si el paciente no tiene diagnósticos el diagnótico 1 queda vacío
        # y diagnóstico 2 queda como una lista vacía 
        diagnostico1 = ""
        diagnostico2 = []
        print("DIAGNÓSTICO 1: ", diagnostico1)
        print("DIAGNOSTICO 2: ", diagnostico2)

    
    

    #print(diagnosticos)
