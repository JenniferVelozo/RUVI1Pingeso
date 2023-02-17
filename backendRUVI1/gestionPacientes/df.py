#################
import os
from datetime import datetime
import time 
import pandas as pd
from gestionPacientes.repMensual import mensual
from gestionPacientes.models import *
#from backendRUVI1.gestionPacientes.models import Servicio


def leerDf():
    '''Se lee el archivo de los pacientes cargado en el excel de pacientes.csv y se crea el resumen para los
    pacientes.'''
    # Se leen los archivos de cie10, norma y pacientes.
    path = os.path.dirname(os.path.realpath(__file__))
    archivo = path+'\CIE10-GRD.xlsm'
    cie10 = pd.read_excel(archivo, sheet_name='CIE10 MOD')
    norma = pd.read_excel(archivo, sheet_name='NORMA')
    archivo = path+'\PACIENTES.csv'

    print("Inicia creacion resumen de pacientes.")
    # Se intenta leer el archivo de pacientes. Este archivo debe ser un .csv separado por el simbolo ~
    try:
        pacientes= pd.read_csv(archivo, sep='~',encoding='latin-1')
    except pd.errors.ParserError:
        return False, []

    #Se eliminan del archivo leido los pacientes que no corresponden.
    print("Eliminando pacientes HEGC")
    pacientes.drop(pacientes[pacientes['ActualServicioClínico_Desc']=='(UTI)Unidad de Tratamiento Intermedio HEGC'].index, inplace=True)
    pacientes.drop(pacientes[pacientes['ActualServicioClínico_Desc']=='Unidad de Emergencia HEGC'].index, inplace=True)
    pacientesEnCierre=[]

    print("Eliminando pacientes en cierre")
    for i in range(len(pacientes)):
        if str(pacientes.iloc[i]['ActualHabitación_Desc']).count('Cierre de Atención')!=0:
            pacientesEnCierre.append(i)
        else:
            pass
    pacientes.drop(pacientesEnCierre, inplace=True)

    # Se tranforma a numérico entero el IR GRD ya que lo toma con un .0 al final
    norma["IR-GRD CÓDIGO v2.3"] = pd.to_numeric(norma["IR-GRD CÓDIGO v2.3"], downcast='integer')
    # Se recorre el dataframe de los pacientes
    jsonRes=[]
    largo=len(pacientes)
    print("Cargando pacientes")
    for i in range(largo):
        print(str(i+1)+"/"+str(largo))
        # Si el paciente no tiene rut, se deja como string vacío 
        if str(pacientes.iloc[i]['RUNPaciente']) == 'nan':
            rut = ""
        else:
            rut = pacientes.iloc[i]['RUNPaciente']
        # Se obtiene el nombre del paciente
        nombre = ""        
        if str(pacientes.iloc[i]['NombrePaciente']) == 'nan':
            nombreAux = ""
        else:
            nombreAux = pacientes.iloc[i]['NombrePaciente']
        if str(pacientes.iloc[i]['ApellidoPaterno']) == 'nan':
            apellido_pat = ""
        else:
            apellido_pat = pacientes.iloc[i]['ApellidoPaterno']
        if str(pacientes.iloc[i]['ApellidoMaterno']) == 'nan':
            apellido_mat = ""
        else:
            apellido_mat = pacientes.iloc[i]['ApellidoMaterno']
        nombre = nombre + nombreAux +" " +apellido_pat + " " +apellido_mat
        #Se obtienen los datos de la ultima cama del paciente y los dias de estadia.
        if str(pacientes.iloc[i]['UltimaCama']) != 'nan':
            ult_cama = str(pacientes.iloc[i]['UltimaCama'])
            ult_cama = ult_cama[0:9]
        else:
            ult_cama = ""
        
        if str(pacientes.iloc[i]['DíasEstada']) != 'nan':
            dias_estada = str((int) (pacientes.iloc[i]['DíasEstada']))
        else:
            dias_estada = ""
        
        # Para encontrar el diagnositco principal
        diagnostico1Cod = pacientes.iloc[i]['DiagnosticoPrincipal'] 
        diagnostico2 = pacientes.iloc[i]['ListaDiagnosticosEpisodio']  
        diag2_final = ""
        # Para considerar los diagnósticos secundarios
        nombres_diags2 = []
        diagnostico2Cod=diagnostico2
        diagnostico2Json=[]
        if str(diagnostico2) == 'nan':
            diagnostico2 = []
            diagnostico2Cod=None
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
                    diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                    grd = str(grd_diagnostico2['GRD'].values[0])
                    sev = str(sev_diagnostico2['SEV'].values[0])
                    aux['codigo']=str(diag)
                    aux['nombre']=str(diagnostico_dos)
                    
                    diagnostico2Json.append(aux)
                
                else:
                    condicion = cie10.loc[:, 'CODIGO'] == diag+'.0'
                    diagnostico2_pd = cie10.loc[condicion]
                    grd_diagnostico2 = diagnostico2_pd['GRD'].to_frame(name='GRD')
                    sev_diagnostico2 = diagnostico2_pd['SEV'].to_frame(name = 'SEV')
                    nombre_diagnostico2 = diagnostico2_pd['DIAGNOSTICO'].to_frame(name='DIAGNOSTICO')
                    try:
                        diagnostico_dos = nombre_diagnostico2['DIAGNOSTICO'].values[0]
                    except IndexError:
                        errSinCIE10=list()
                        
                        errSinCIE10.append(nombre)
                        errSinCIE10.append(diag)
                        errSinCIE10.append(rut)
                        return False, errSinCIE10
                    grd = str(grd_diagnostico2['GRD'].values[0])
                    sev = str(sev_diagnostico2['SEV'].values[0])
                    aux['codigo']=str(diag)
                    aux['nombre']=str(nombre_diagnostico2)
                    
                    diagnostico2Json.append(aux)


                nombres_diags2.append(diagnostico_dos)
                diag2_final=""
                for j in range(len(nombres_diags2)-1):
                    diag2_final = diag2_final + nombres_diags2[j] +", "
                diag2_final = diag2_final + nombres_diags2[len(nombres_diags2)-1]

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
            diagnostico1Cod=None

        # El GRD y SEV quedan como decimal por lo que se quita 
        # lo que está después del '.'
        if '.' in grd:
            j = grd.find('.')
            grd = grd[0:j]
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

        # Ahora se busca el código IR-GRD en la norma
        norma["IR-GRD CÓDIGO v2.3"]=norma["IR-GRD CÓDIGO v2.3"].apply(str)
        condicion2 = norma.loc[:,'IR-GRD CÓDIGO v2.3'] == codigo_norma
        fila_norma = norma.loc[condicion2]
        pc_corte = 0
        peso_grd = 0
        em_norma = 0
        if fila_norma.size == 0:
            print("No tiene NORMA")
        else:
            pc_corte = fila_norma['PC superior'].values[0]
            peso_grd = fila_norma['Peso GRD'].values[0]
            em_norma = fila_norma['EM \n(inlier)'].values[0]        
        nombreServicio=None
        id_servicios=None
        nombreServicio=pacientes.iloc[i]['ActualServicioClínico_Desc']
        id_servicios=None
        if str(nombreServicio)!= 'nan':
            try:
                servicio=Servicio.objects.get(nombre=nombreServicio.strip(' '))
                id_servicios=servicio.id
            except Servicio.DoesNotExist:
                id_servicios=None
            except Servicio.MultipleObjectsReturned:
                id_servicios=None        
        
        #se busca el paciente en el resumen antiguo
        try:
            pAntiguo = Resumen.objects.get(servicio_id=id_servicios, rut = rut, nombrePaciente = nombre, flag_diag=True)
        except Resumen.DoesNotExist:
            try:
                pAntiguo = Resumen.objects.get(servicio_id=id_servicios, rut = rut, nombrePaciente = nombre, flag_pend=True)
            except Resumen.DoesNotExist:
                pAntiguo=None
            except Resumen.MultipleObjectsReturned:
                pAntiguo=None
        except Resumen.MultipleObjectsReturned:
            pAntiguo=None
        
        #si el paciente existe en el anterior y tiene cambios en los diagnosticos o los pendientes.
        flagCambios=False    
        flagPend=False
        pendJson= {}
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
        if dias_estada == '':
            dias_estada = 0
        #calculo de critero
        criterio = None
        if pc_corte!=0:
            criterio=float(dias_estada)/float(pc_corte)   

        #se guarda en un json y se agrega a la lista de pacientes.
        aux={}
        aux["rut"]= rut
        aux["nombrePaciente"]= nombre 
        if id_servicios == 0:
            id_servicios = None
        aux["servicio_id"]=id_servicios 
        aux["nombreServicio"]=nombreServicio
        aux["cama"] = ult_cama
        aux["estancia"] = int(dias_estada) 
        if criterio==None:
            aux["criterio"]=0
        else:
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
        aux["pendientesJson"]=pendJson
        jsonRes.append(aux)  

    #Borra el resumen anterior
    try:
        Resumen.objects.all().delete()
    except Resumen.DoesNotExist:
        pass
    #guarda el resumen actual.
    now = datetime.now()
    fecha=now
    #Cuando se agrega un resumen se crea su historico, si se sube mas de un resumen en un dia el historico de ese dia se borra
    #Cuando existe un cambio de fecha en mes/año del resumen en comparacion al ultimo historico, se crea un reporte mensual.
    try:
        hist= Historico.objects.all().latest('fecha')
        indicador=(fecha.month-hist.fecha.month)+(fecha.year-hist.fecha.year)+(fecha.day-hist.fecha.day)
        print("indicador: "+str(indicador))
        print("año: "+str(fecha.year))
        print("mes: "+str(fecha.month))
        print("dia: "+str(fecha.day))
        print("--------------------------")
        print("año: "+str(hist.fecha.year))
        print("mes: "+str(hist.fecha.month))
        print("dia: "+str(hist.fecha.day))
        if indicador==0:
            Historico.objects.filter(fecha=fecha).delete()
        else:
            men=ReporteMensual.objects.all().latest('fecha')
            indicador=(fecha.month-men.fecha.month)+(fecha.year-men.fecha.year)
            if indicador!=1: 
                if str(men.fecha.month)=='12':
                    mensual('01',men.fecha.year+1)
                else:
                    mensual(men.fecha.month+1,men.fecha.year)
                    
    except Historico.DoesNotExist:
        print("No hay historico")
        hist=None
    time.sleep(1233)
    #Se guarda en la BD el resumen y el historico.
    for paciente in jsonRes:
        a = Resumen.objects.create(updated_at=fecha,rut = paciente["rut"], nombrePaciente = paciente["nombrePaciente"], servicio_id=paciente["servicio_id"], nombreServicio=paciente["nombreServicio"], cama =  paciente["cama"], estancia = paciente["estancia"], criterio=paciente["criterio"], diagnostico1 = paciente["diagnostico1"], diagnostico1Cod=paciente["diagnostico1Cod"],diagnostico2= paciente["diagnostico2"], diagnostico2Cod=paciente["diagnostico2Cod"],ir_grd = paciente["ir_grd"], emNorma = paciente["emNorma"], pcSuperior = paciente["pcSuperior"], pesoGRD = paciente["pesoGRD"], flag_diag=paciente["flag_diag"], flag_pend= paciente["flag_pend"], pendientesJson= paciente["pendientesJson"], diagnostico2Json=paciente["diagnostico2Json"])
        a.save()
        #guarda en tabla de historicos
        b= Historico.objects.create(fecha=fecha, rut = paciente["rut"], nombrePaciente = paciente["nombrePaciente"], servicio_id=paciente["servicio_id"], nombreServicio=paciente["nombreServicio"], cama =  paciente["cama"], estancia = paciente["estancia"], criterio=paciente["criterio"], diagnostico1 = paciente["diagnostico1"], diagnostico1Cod=paciente["diagnostico1Cod"],diagnostico2= paciente["diagnostico2"], diagnostico2Cod=paciente["diagnostico2Cod"],ir_grd = paciente["ir_grd"], emNorma = paciente["emNorma"], pcSuperior = paciente["pcSuperior"], pesoGRD = paciente["pesoGRD"], flag_diag=paciente["flag_diag"], flag_pend= paciente["flag_pend"], pendientesJson= paciente["pendientesJson"])
        b.save()
    print("Resumen de pacientes finalizado.")
    return True,[]
    



if __name__=='__main__':
    leerDf()