from asyncio.windows_events import NULL
from cmath import nan
import os
import pandas as pd


from gestionPacientes.models import Resumen



def leerDf():
    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm'
    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')

    norma = pd.read_excel(archivo, sheet_name='NORMA')
    print(norma)


    archivo = path+'\PRESTACIONES_CAUSAS.xlsx'

    archivo = path+'\PACIENTES.xlsx'
    pacientes= pd.read_excel(archivo, sheet_name='NUEVO FORMATO BD')
    print(pacientes)
    # Se recorre el dataframe de los pacientes
    for i in range(len(pacientes)):
        diagnosticos = pacientes.iloc[i]['DiagnosticosEpisodio']  
        print("\n MOSTRANDO PACIENTE: ", pacientes.iloc[i]['RUNPaciente'])
        

        if str(diagnosticos) != 'nan':
            diagnosticos = diagnosticos.split(',')
            diagnostico1 = diagnosticos[0]
            diagnostico2 = diagnosticos[1:len(diagnosticos)]
            
            #print(diagnostico1)
            #print(cie10.where(cie10['codigo'] == diagnostico1))

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

            # Ahora se busca el código IR-GRD en la norma
            norma["IR-GRD CÓDIGO v2.3"]=norma["IR-GRD CÓDIGO v2.3"].apply(str)

            codigo_norma = codigo_norma
            print("Nuevo cod: ", codigo_norma)
            #print(norma.loc[:,'IR-GRD CÓDIGO v2.3'])
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
                pc_corte = fila_norma['PC superior'].values[0]
                peso_grd = fila_norma['Peso GRD'].values[0]
                em_norma = float(fila_norma['EM \n(inlier)'].values[0])


                
            print(" El puntaje de corte es: ",pc_corte)
            print(" El peso grd es : ", peso_grd)
            print(" El EM es: ", em_norma)
            #fila_norma = fila_norma[:].to_frame(name='Peso GRD')
            #print(fila_norma)

            


            rut = pacientes.iloc[i]['RUNPaciente']
            nombre = str(pacientes.iloc[i]['NombrePaciente'])+" "+str(pacientes.iloc[i]['ApellidoPaterno'])+" "+str(pacientes.iloc[i]['ApellidoMaterno'])
            resumen = Resumen.objects.get_or_create(rut = rut, nombrePaciente = nombre, cama = ult_cama, estancia = dias_estada, diagnostico1 = diagnostico_uno, ir_grd = grd, emNorma = em_norma, pcSuperior = pc_corte, pesoGRD = peso_grd)[0]

            
            
            resumen.save()
            
            
            #print("SEV: ", sev_diagnostico1['sev'])

            #print (diagnostico1_pd.to_frame(name='NOMBRE'))

            

            
    

        else:
            # Si el paciente no tiene diagnósticos el diagnótico 1 queda vacío
            # y diagnóstico 2 queda como una lista vacía 
            diagnostico1 = ""
            diagnostico2 = []
            print("DIAGNÓSTICO 1: ", diagnostico1)
            print("DIAGNOSTICO 2: ", diagnostico2)

        
        

        #print(diagnosticos)
if __name__=='__main__':
    leerDf()