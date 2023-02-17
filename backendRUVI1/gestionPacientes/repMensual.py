from asyncio.windows_events import NULL
from cmath import nan
from datetime import datetime
import json
import os

import pandas as pd
from gestionPacientes.models import *


def mensual(mes, year):
    '''Funcion genera un reporte mensual. El reporte mensual contempla estadisticas de los resumenes de pacientes
    del mes y año indicado de entrada'''
    #obtiene los historicos del mes y año.
    historicos=Historico.objects.filter(fecha__year=year, fecha__month=mes)
    servicios=Servicio.objects.all()
    mensual=[]
    for servicio in servicios:
       
        em=0 #promedio estancia
        emaf=0 #promedio emNorma
        iema=0
        iemainliersMenor=0
        iemainliersMayor=0
        outliers=0 # porcentaje estancia/pcSuperior
        peso=0 #promedio peso
        count=0 #contador
        countP=0 # contador para los porcentajes de pendientes

        #pendientes
        internas=0
        externas=0
        condicion=0
        print("--------------INICIO---------------")
        #Para cada paciente se suman los contadores segun corresponde
        for paciente in historicos:
            if paciente.servicio_id==servicio.id:
                #si el paciente tiene norma y grupo grd
                if paciente.emNorma!=0 and paciente.ir_grd!='0' and paciente.ir_grd!=NULL and paciente.ir_grd!= 'R':
        
                    peso=peso+paciente.pesoGRD
                    em=em+int(paciente.estancia)
                    emaf=emaf+paciente.emNorma
                    if paciente.criterio>=1:
                        outliers=outliers+1
                    else:
                        iema=int(paciente.estancia)/paciente.emNorma
                        if iema<=1:
                            iemainliersMayor=iemainliersMayor+1
                        else:
                            iemainliersMenor=iemainliersMenor+1
                    
                    count=count+1
                #si el paciente tiene pendientes
                if paciente.pendientesJson!=0:
                    internas=paciente.pendientes.filter(causa='INTERNAS').count() + internas
                    externas=paciente.pendientes.filter(causa='EXTERNAS').count() + externas
                    condicion=paciente.pendientes.filter(causa='CONDICIÓN CLÍNICA').count() + condicion
                    countP=internas+externas+condicion
            
            
        #si existen datos a considerar
        if count!=0:
            peso=peso/count
            em=em/count
            emaf=emaf/count
            if emaf!=0:
                iema=em/emaf
            else: 
                iema=0
            outliers=(outliers*100)/count
            iemainliersMenor=(iemainliersMenor*100)/count
            iemainliersMayor=(iemainliersMayor*100)/count

        #si existen datos de pendientes
        if countP!=0:
            internas=(internas*100)/countP
            externas=(externas*100)/countP
            condicion=(condicion*100)/countP
       
        print("-------------FIN----------------")
        #crea reporte mensual.
        fecha=str(year) +'-'+str(mes)+'-01' 
        a, created= ReporteMensual.objects.get_or_create(fecha=fecha,servicio=Servicio.objects.get(id=servicio.id), servicioNombre=servicio.nombre, peso=peso,
        em=em,
        emaf=emaf,
        iema=iema,
        outliers=outliers,
        iemainliersMenor=iemainliersMenor,
        iemainliersMayor=iemainliersMayor,
        pInt=internas,
        pExt=externas,
        condP=condicion)
    
    print("Reporte mensual creado.")
    
def reductor():
    print("Comienza el proceso.")
    #segun lo acordado las fechas deben corresponder con las fechas de los datos utilizados, esto porque
    #se encuentran desfasadas un mes.
    print("Las fechas del reporte mensual seran reducidas en un mes.")
    reportes=ReporteMensual.objects.all()
    print(".........")
    for reporte in reportes:
        aux=reporte.fecha
        if str(aux.month)=='1':
            reporte.fecha=str(aux.year-1)+'-12-01'
        else:
            reporte.fecha=str(aux.year)+'-'+str(aux.month-1)+'-01'
        reporte.save()
    print("Cambio guardado correctamente.")

if __name__=='__main__':
    print("Main ")

    mensual('02','2023')
    print("prueba exitosa")