from asyncio.windows_events import NULL
from cmath import nan
import json
import os
from datetime import datetime

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
    archivo = path+'\PACIENTES.csv'
    pacientes= pd.read_csv(archivo, sep=';', encoding='latin-1')
    
    pacientes.drop(pacientes[pacientes['ActualServicioClínico_Desc']=='(UTI)Unidad de Tratamiento Intermedio HEGC'].index, inplace=True)
    pacientes.drop(pacientes[pacientes['ActualServicioClínico_Desc']=='Unidad de Emergencia HEGC'].index, inplace=True)
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
            print("EL RUT ES NAAAAN")
            rut = ""
        else:
            rut = pacientes.iloc[i]['RUNPaciente']

        # Se obtiene el nombre del paciente
        nombre = ""
        print(type(pacientes.iloc[i]['ApellidoPaterno']))
        
        if str(pacientes.iloc[i]['NombrePaciente']) == 'nan':
            print("EL nombres es NAAAAAAAAAAAAAN")
            nombreAux = ""
        else:
            nombreAux = pacientes.iloc[i]['NombrePaciente']


        if str(pacientes.iloc[i]['ApellidoPaterno']) == 'nan':
            print("EL apellido pat  es NAAAAAAAAAAAAAN")
            apellido_pat = ""
        else:
            apellido_pat = pacientes.iloc[i]['ApellidoPaterno']

        if str(pacientes.iloc[i]['ApellidoMaterno']) == 'nan':
            print("EL apellido mat  es NAAAAAAAAAAAAAN")
            apellido_mat = ""
        else:
            apellido_mat = pacientes.iloc[i]['ApellidoMaterno']

        nombre = nombre + nombreAux +" " +apellido_pat + " " +apellido_mat

        
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
        diagnostico1Cod = pacientes.iloc[i]['DiagnosticoPrincipal'] 
        # print(diagnostico1)

        diagnostico2 = pacientes.iloc[i]['ListaDiagnosticosEpisodio']  
        diag2_final = ""
        
        # print(diagnostico2)
        # Para considerar los diagnósticos secundarios

        nombres_diags2 = []
        # print(type(nombres_diags2))
        diagnostico2Cod=diagnostico2
        diagnostico2Json=[]
        if str(diagnostico2) == 'nan':
            diagnostico2 = []
            diagnostico2Cod=NULL
        else:
            diagnostico2 = str(diagnostico2).split(',')
            for diag in diagnostico2:
                condicion_diag2 = cie10.loc[:, 'CODIGO'] == diag
                diagnostico2_pd = cie10.loc[condicion_diag2]

                grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
                sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
                nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                aux={}

                if grd_diagnostico2.size != 0:
                    print("AAAAAAAAAAAAAAAAAAAAAAAAA")
                    diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                    grd = str(grd_diagnostico2['GRD'].values[0])
                    sev = str(sev_diagnostico2['SEV'].values[0])
                    aux['codigo']=str(diag)
                    aux['nombre']=str(diagnostico_dos)
                    
                    diagnostico2Json.append(aux)
                
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
                    aux['codigo']=str(diag)
                    aux['nombre']=str(nombre_diagnostico2)
                    
                    diagnostico2Json.append(aux)


                nombres_diags2.append(diagnostico_dos)
                diag2_final=""
                for i in range(len(nombres_diags2)-1):
                    diag2_final = diag2_final + nombres_diags2[i] +", "
                    print(diag2_final)
                diag2_final = diag2_final + nombres_diags2[len(nombres_diags2)-1]
        print("Diagnóstico 2: ", diagnostico2)
        print("Nombres diag2: ", nombres_diags2)
        #diagnostico2Json=json.dumps(diagnostico2Json)
        
        
        if str(diagnostico1Cod) != 'nan':
            # Aquí busca el código del diagnóstico en el CIE10
            condicion = cie10.loc[:, 'CODIGO'] == diagnostico1Cod
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
                condicion = cie10.loc[:, 'CODIGO'] == diagnostico1Cod+'.0'
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
            diagnostico1Cod=NULL

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


        
        if str(pacientes.iloc[i]['RUNPaciente']) == '111':
            print("ENCONTRÓ PACIENTE RARO********************************************************************************************")
            break

        nombreServicio=pacientes.iloc[i]['ActualServicioClínico_Desc']
        print(nombreServicio)
        id_servicios=None
        if str(nombreServicio)!= 'nan':
            servicio=Servicio.objects.get(nombre=nombreServicio.strip(' '))
            id_servicios=servicio.id
        print("id_Servicio", id_servicios)
        
        
        #se busca el paciente en el resumen antiguo
        try:
            pAntiguo = Resumen.objects.get(rut = rut, nombrePaciente = nombre)
        except Resumen.DoesNotExist:
            pAntiguo=None
        except Resumen.MultipleObjectsReturned:
            pAntiguo=None
        
        #si el paciente existe en el anterior y flag=true
        flagCambios=False    
        flagPend=False
        pendJson= NULL
        if pAntiguo!=None:
            if pAntiguo.flag_diag:
                diagnostico_uno=pAntiguo.diagnostico1
                diagnostico1Cod=pAntiguo.diagnostico1Cod
                diag2_final=pAntiguo.diagnostico2
                diagnostico2Cod=pAntiguo.diagnostico2Cod
                diagnostico2Json=pAntiguo.diagnostico2Json
                grd=pAntiguo.ir_grd
                pc_corte=pAntiguo.pcSuperior
                em_norma=pAntiguo.emNorma
                peso_grd=pAntiguo.pesoGRD
                flagCambios=True
            if pAntiguo.flag_pend:
                flagPend=True
                pendJson=pAntiguo.pendientesJson
            print(flagPend)
        if dias_estada == '':
            dias_estada = 0
        #calculo de critero
        criterio = NULL
        if pc_corte!=0:
            criterio=float(dias_estada)/float(pc_corte)
        
        print("Dias de estada: ", dias_estada)
        print("Puntaje de corte: ", pc_corte)
        print("Valor criterio: ", criterio)
        
        #se guarda en un json y se agrega a la lista.
        aux={}
        aux["rut"]= rut
        aux["nombrePaciente"]= nombre 
        
            

        
        if id_servicios == 0:
            print("ENTRAAAAAAAAAAAAAAAAAAAA...................................................")
            id_servicios = None
            print(id_servicios)
           
        aux["servicio_id"]=id_servicios 
        aux["nombreServicio"]=nombreServicio
        aux["cama"] = ult_cama
        aux["estancia"] = int(dias_estada) 
        aux["criterio"]=float(criterio)
        aux["diagnostico1"]= diagnostico_uno
        aux["diagnostico1Cod"]=diagnostico1Cod
        aux["diagnostico2"]= diag2_final
        aux["diagnostico2Cod"]=diagnostico2Cod
        aux["diagnostico2Json"]=diagnostico2Json
        aux["ir_grd"] = grd
        aux["emNorma"]= float(em_norma)
        aux["pcSuperior"]= int(pc_corte)
        aux["pesoGRD"] = float(peso_grd)
        aux["flag_diag"]=flagCambios
        aux["flag_pend"]=flagPend
        aux["pendientesJson"]={}
        jsonRes.append(aux)
        print(aux)


        
    
    
    print(len(jsonRes))
    #Borra el resumen anterior
    Resumen.objects.all().delete()
    #guarda el resumen actual.
    #print(jsonRes)
    now = datetime.now()
    fecha=now
    #print(fecha)
    i = 0
    for paciente in jsonRes:
        print(i)
        #fecha=str(now.year) +'-'+str(now.month)+'-'+str(now.day)+' '+str(now.hour)+':'+str(now.minute)+':'+str(now.second)
        #print("----------------------------------------------------------------")

        a = Resumen.objects.create(updated_at=fecha,rut = paciente["rut"], nombrePaciente = paciente["nombrePaciente"], servicio_id=paciente["servicio_id"], nombreServicio=paciente["nombreServicio"], cama =  paciente["cama"], estancia = paciente["estancia"], criterio=paciente["criterio"], diagnostico1 = paciente["diagnostico1"], diagnostico1Cod=paciente["diagnostico1Cod"],diagnostico2= paciente["diagnostico2"], diagnostico2Cod=paciente["diagnostico2Cod"],ir_grd = paciente["ir_grd"], emNorma = paciente["emNorma"], pcSuperior = paciente["pcSuperior"], pesoGRD = paciente["pesoGRD"], flag_diag=paciente["flag_diag"], flag_pend= paciente["flag_pend"], pendientesJson= paciente["pendientesJson"], diagnostico2Json=paciente["diagnostico2Json"])


        #print("\n")
        #print(paciente)
        a.save()
        #print(created)
        
        #guarda en tabla de historicos
        b= Historico.objects.create(fecha=fecha, rut = paciente["rut"], nombrePaciente = paciente["nombrePaciente"], servicio_id=paciente["servicio_id"], nombreServicio=paciente["nombreServicio"], cama =  paciente["cama"], estancia = paciente["estancia"], criterio=paciente["criterio"], diagnostico1 = paciente["diagnostico1"], diagnostico1Cod=paciente["diagnostico1Cod"],diagnostico2= paciente["diagnostico2"], diagnostico2Cod=paciente["diagnostico2Cod"],ir_grd = paciente["ir_grd"], emNorma = paciente["emNorma"], pcSuperior = paciente["pcSuperior"], pesoGRD = paciente["pesoGRD"], flag_diag=paciente["flag_diag"], flag_pend= paciente["flag_pend"], pendientesJson= paciente["pendientesJson"])
        #crea al mismo paciente en historico de dif fechas, solo para pruebas
        j=10

        b.save()
        i = i+1
        '''
        fecha=str(now.year) +'-'+str(now.month)+'-'
        while j<20:
            b ,created = Historico.objects.get_or_create(fecha=fecha+str(j), rut = paciente["rut"], nombrePaciente = paciente["nombrePaciente"], servicio_id=paciente["servicio_id"], nombreServicio=paciente["nombreServicio"], cama =  paciente["cama"], estancia = paciente["estancia"], criterio=paciente["criterio"], diagnostico1 = paciente["diagnostico1"], diagnostico1Cod=paciente["diagnostico1Cod"],diagnostico2= paciente["diagnostico2"], diagnostico2Cod=paciente["diagnostico2Cod"],ir_grd = paciente["ir_grd"], emNorma = paciente["emNorma"], pcSuperior = paciente["pcSuperior"], pesoGRD = paciente["pesoGRD"], flag_diag=paciente["flag_diag"], flag_pend= paciente["flag_pend"], pendientesJson= paciente["pendientesJson"])
            print(b.save())
            j=j+1'''
        
    print("fin")
    



if __name__=='__main__':
    leerDf()