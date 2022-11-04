from asyncio.windows_events import NULL
from cmath import nan
import json
import os

import pandas as pd
from gestionPacientes.models import *
#from backendRUVI1.gestionPacientes.models import Servicio

from gestionPacientes.models import Resumen, Pacientes

def leerDf():
    # Se lee el archivo del CIE10
    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm'
    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    norma = pd.read_excel(archivo, sheet_name='NORMA')
    print(norma)
    archivo = path+'\PRESTACIONES_CAUSAS.xlsx'
    archivo = path+'\PACIENTES.xlsx'
    pacientes= pd.read_excel(archivo, sheet_name='DEFINITIVO')
    print(pacientes)
    #print(pd.to_numeric(norma["IR-GRD CÓDIGO v2.3"], downcast='integer'))
    # Se tranforma a numérico entero el IR GRD ya que lo toma con un .0 al final
    norma["IR-GRD CÓDIGO v2.3"] = pd.to_numeric(norma["IR-GRD CÓDIGO v2.3"], downcast='integer')
    print(norma["IR-GRD CÓDIGO v2.3"])

    # Se recorre el dataframe de los pacientes
    jsonRes=[]
    for i in range(len(pacientes)):
        

        # Si el paciente no tiene rut, se deja como string vacío 
        if str(pacientes.iloc[i]['RUNPaciente']) == 'nan':
            print("entra")
            rut = ""
        else:
            rut = pacientes.iloc[i]['RUNPaciente']

        # Se obtiene el nombre del paciente
        nombre = ""

        if str(pacientes.iloc[i]['ApellidoPaterno']) == 'nan':
            pacientes.iloc[i]['ApellidoPaterno'] = ""

        if str(pacientes.iloc[i]['ApellidoMaterno']) == 'nan':
            pacientes.iloc[i]['ApellidoMaterno'] = ""

        nombre = nombre + str(pacientes.iloc[i]['NombrePaciente'])+" "+str(pacientes.iloc[i]['ApellidoPaterno'])+" "+str(pacientes.iloc[i]['ApellidoMaterno'])

        
        print("\n MOSTRANDO PACIENTE: ", rut)
        print("Nombre: ", nombre)
        if str(pacientes.iloc[i]['UltimaCama']) != 'nan':
            ult_cama = str(pacientes.iloc[i]['UltimaCama'])
            ult_cama = ult_cama[0:9]
        else:
            ult_cama = ""
        
        if str(pacientes.iloc[i]['DíasEstada']) != 'nan':
            dias_estada = str((int) (pacientes.iloc[i]['DíasEstada']))
        else:
            dias_estada = ""
        print("La última cama es: ", ult_cama)
        print("Los días de estada: ", dias_estada)
        
        #grd = 0
        #sev = 0
        diagnostico1 = pacientes.iloc[i]['DiagnosticoPrincipal'] 
        # print(diagnostico1)

        diagnostico2 = pacientes.iloc[i]['ListaDiagnosticosEpisodio']  
        diag2_final = ""
        
        # print(diagnostico2)
        # Para considerar los diagnósticos secundarios

        nombres_diags2 = []
        # print(type(nombres_diags2))
        if str(diagnostico2) == 'nan':
            diagnostico2 = []
        else:
            diagnostico2 = str(diagnostico2).split(',')
            for diag in diagnostico2:
                condicion_diag2 = cie10.loc[:, 'CODIGO'] == diag
                diagnostico2_pd = cie10.loc[condicion_diag2]

                grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
                sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
                nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                
                if grd_diagnostico2.size != 0:
                    print("AAAAAAAAAAAAAAAAAAAAAAAAA")
                    diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                    grd = str(grd_diagnostico2['GRD'].values[0])
                    sev = str(sev_diagnostico2['SEV'].values[0])
                
                else:
                    print("No tiene GRD")
                    print("GRD CONFLICTO...")
                    condicion = cie10.loc[:, 'CODIGO'] == diag+'.0'
                    print(diag)
                    diagnostico2_pd = cie10.loc[condicion]
                    grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
                    sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
                    nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                    diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                    grd = str(grd_diagnostico2['GRD'].values[0])
                    sev = str(sev_diagnostico2['SEV'].values[0])


                nombres_diags2.append(diagnostico_dos)
                
                for i in range(len(nombres_diags2)-1):
                    diag2_final = diag2_final + nombres_diags2[i] +", "
                diag2_final = diag2_final + nombres_diags2[len(nombres_diags2)-1]
        print("Diagnóstico 2: ", diagnostico2)
        print("Nombres diag2: ", nombres_diags2)
        
        
        if str(diagnostico1) != 'nan':
            # Aquí busca el código del diagnóstico en el CIE10
            condicion = cie10.loc[:, 'CODIGO'] == diagnostico1
            diagnostico1_pd = cie10.loc[condicion]

            grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
            sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
            nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
            if grd_diagnostico1.size != 0:
                diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico1['GRD'].values[0])
                sev = str(sev_diagnostico1['SEV'].values[0])
                
            else:
                print("No tiene GRD")
                print("GRD CONFLICTO...")
                condicion = cie10.loc[:, 'CODIGO'] == diagnostico1+'.0'
                diagnostico1_pd = cie10.loc[condicion]
                grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
                sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
                nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico1['GRD'].values[0])
                sev = str(sev_diagnostico1['SEV'].values[0])
        else:
            diagnostico_uno = ""
            grd = ""
            sev = ""

        print("DIAGNÓSTICO 1: ", diagnostico_uno)
        print("GRD ANTES: ", grd)
        print("SEV ANTES: ", sev)

        # El GRD y SEV quedan como decimal por lo que se quita 
        # lo que está después del '.'
        if '.' in grd:
            i = grd.find('.')
            print(i)
            grd = grd[0:i]

        if '.' in sev:
            i2 = sev.find('.')
            sev = sev[0:i2]

        # Si la severidad es 0 o N entonces se añade un 1 al GRD
        if sev == '0' or sev == 'N':
            codigo_norma = str(grd)+'1'
        # Si la severidad es CC entonces se añade un 2 al GRD
        elif sev == 'CC':
            codigo_norma = str(grd)+'2'
        # Si la severidad es MCC entonces se añade un 3 al GRD
        elif sev == 'MCC':
            codigo_norma = str(grd)+'3'
        # Sino se añade un 1 al GRD
        else:
            codigo_norma = str(grd)+'1'

        print("GRD DESPUÉS: ", grd)
        print("SEV DESPUÉS: ", sev)
        print("El código norma es: ", codigo_norma)
        print("El largo código norma es: ", len(codigo_norma))

        # Ahora se busca el código IR-GRD en la norma
        norma["IR-GRD CÓDIGO v2.3"]=norma["IR-GRD CÓDIGO v2.3"].apply(str)
        # print(norma.loc[:,'IR-GRD CÓDIGO v2.3'])
        # print(type(norma.loc[:,'IR-GRD CÓDIGO v2.3']))
        condicion2 = norma.loc[:,'IR-GRD CÓDIGO v2.3'] == codigo_norma
        # print("condicion 2: ",condicion2)
        fila_norma = norma.loc[condicion2]
        # print(fila_norma)
        #print(fila_norma)
        pc_corte = 0
        peso_grd = 0
        em_norma = 0
        if fila_norma.size == 0:
            print("No tiene NORMA")
        else:
            print("TIENE NORMA -------------------------------------------------------------------------")
            pc_corte = fila_norma['PC superior'].values[0]
            peso_grd = fila_norma['Peso GRD'].values[0]
            em_norma = fila_norma['EM \n(inlier)'].values[0]

        print(" El puntaje de corte es: ",pc_corte)
        print(" El peso grd es : ", peso_grd)
        print(" El EM es: ", em_norma)

        criterio = NULL
        if pc_corte!=0:
            criterio=float(dias_estada)/float(pc_corte)
        
        print("Dias de estada: ", dias_estada)
        print("Puntaje de corte: ", pc_corte)
        print("Valor criterio: ", criterio)


        '''
        if str(diagnostico1) != 'nan':
            #diagnosticos = pacientes.iloc[i]['DiagnosticosEpisodio']  
            #diagnosticos = diagnosticos.split(',')
            #diagnostico1 = pacientes.iloc[i]['DiagnosticoPrincipal']  
            diagnostico2 = pacientes.iloc[i]['ListaDiagnosticosEpisodio']  
            
            # Aquí busca el código del diagnóstico en el CIE10
            condicion = cie10.loc[:, 'CODIGO'] == diagnostico1
            diagnostico1_pd = cie10.loc[condicion]
            #print(diagnostico1_pd)

            grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
            sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
            nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
            

            if grd_diagnostico1.size != 0:
                diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico1['GRD'].values[0])
                sev = str(sev_diagnostico1['SEV'].values[0])
                
            else:
                print("No tiene GRD")
                print("GRD CONFLICTO...")
                condicion = cie10.loc[:, 'CODIGO'] == diagnostico1+'.0'
                diagnostico1_pd = cie10.loc[condicion]
                grd_diagnostico1 = diagnostico1_pd['GRD'].to_frame(name='GRD')
                sev_diagnostico1 = diagnostico1_pd['SEV'].to_frame(name = 'SEV')
                nombre_diagnostico1 = diagnostico1_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                diagnostico_uno = nombre_diagnostico1['DIAGNOSTICO'].values[0]
                grd = str(grd_diagnostico1['GRD'].values[0])
                sev = str(sev_diagnostico1['SEV'].values[0])

        else:
            # Si el paciente no tiene diagnósticos el diagnótico 1 queda vacío
            # y diagnóstico 2 queda como una lista vacía 
            diagnostico1 = ""
            diagnostico2 = []
            print("DIAGNÓSTICO 1: ", diagnostico1)
            print("DIAGNOSTICO 2: ", diagnostico2)
        

        print("GRD ANTES: ", grd)
        print("SEV ANTES: ", sev)

        if '.' in grd:
            i = grd.find('.')
            print(i)
            grd = grd[0:i]

        if '.' in sev:
            i2 = sev.find('.')
            sev = sev[0:i2]

        if sev == '0' or sev == 'N':
            codigo_norma = str(grd)+'1'
        elif sev == 'CC':
            codigo_norma = str(grd)+'2'
        elif sev == 'MCC':
            codigo_norma = str(grd)+'3'
        else:
            codigo_norma = str(grd)+'1'

        print("DIAGNÓSTICO: ", diagnostico_uno)
        print("GRD: ", grd)
        print("SEV: ", sev)
        print("El código norma es: ", codigo_norma)
        print("El largo código norma es: ", len(codigo_norma))
        
        # Ahora se busca el código IR-GRD en la norma

        print("Nuevo cod: ", codigo_norma)
        norma["IR-GRD CÓDIGO v2.3"]=norma["IR-GRD CÓDIGO v2.3"].apply(str)
        print(norma.loc[:,'IR-GRD CÓDIGO v2.3'])
        print(type(norma.loc[:,'IR-GRD CÓDIGO v2.3']))
        condicion2 = norma.loc[:,'IR-GRD CÓDIGO v2.3'] == codigo_norma
        print("condicion 2: ",condicion2)
        fila_norma = norma.loc[condicion2]
        print(fila_norma)
        #print(fila_norma)
        pc_corte = 0
        peso_grd = 0
        em_norma = 0
        if fila_norma.size == 0:
            print("No tiene NORMA")
        else:
            print("TIENE NORMA -------------------------------------------------------------------------")
            pc_corte = fila_norma['PC superior'].values[0]
            peso_grd = fila_norma['Peso GRD'].values[0]
            em_norma = fila_norma['EM \n(inlier)'].values[0]

        print(" El puntaje de corte es: ",pc_corte)
        print(" El peso grd es : ", peso_grd)
        print(" El EM es: ", em_norma)

        criterio = NULL
        if pc_corte!=0:
            criterio=float(dias_estada)/float(pc_corte)
        
        print("Dias de estada: ", dias_estada)
        print("Puntaje de corte: ", pc_corte)
        print("Valor criterio: ", criterio)
        '''

        nombreServicio=pacientes.iloc[i]['UltimoServicioClínico_Desc']
        id_servicios=NULL
        if nombreServicio!= NULL:
            servicio=Servicio.objects.get(nombre=nombreServicio)
            id_servicios=servicio.id
        
        
        print("Diag 2 final", diag2_final)
        a ,created = Resumen.objects.get_or_create(rut = rut, nombrePaciente = nombre, servicio_id=id_servicios, nombreServicio=nombreServicio, cama = ult_cama, estancia = dias_estada, criterio=float(criterio), diagnostico1 = diagnostico_uno, diagnostico2= diag2_final, ir_grd = grd, emNorma = em_norma, pcSuperior = pc_corte, pesoGRD = peso_grd, flag_diag=False)
        print(a.save())
        aux={}
        
        aux["rut"]= rut
        aux["nombrePaciente"]= nombre 
        aux["servicio_id"]=id_servicios 
        aux["nombreServicio"]=nombreServicio
        aux["cama"] = ult_cama
        aux["estancia"] = int(dias_estada) 
        aux["criterio"]=float(criterio)
        aux["diagnostico1"]= diagnostico_uno
        aux["diagnostico2"]= diag2_final
        aux["ir_grd"] = grd
        aux["emNorma"]= float(em_norma)
        aux["pcSuperior"]= int(pc_corte)
        aux["pesoGRD"] = float(peso_grd)
        aux["flag_diag"]=False
        #aux=json.dumps(aux)
        jsonRes.append(aux)
    
    jsonRes2={"pacientes": jsonRes}
    print(jsonRes)
    b ,created = Historico.objects.get_or_create(resumen=jsonRes)
    print(b.save())
    
if __name__=='__main__':
    leerDf()