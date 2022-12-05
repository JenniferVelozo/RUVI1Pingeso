from asyncio.windows_events import NULL
from cmath import nan
from datetime import datetime
import json
import os

import pandas as pd
from gestionPacientes.models import *
#from backendRUVI1.gestionPacientes.models import Servicio

#ESTE ARCHIVO ES PARA PROBAR CODIGO 
def mensual(mes, year):
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
        internas=0
        externas=0
        condicion=0
        print("--------------INICO---------------")
        for paciente in historicos:
            if paciente.servicio_id==servicio.id:
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
                if paciente.pendientesJson!=0:
                    print("ENTREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
                    internas=paciente.pendientes.filter(causa='INTERNAS').count() + internas
                    externas=paciente.pendientes.filter(causa='EXTERNAS').count() + externas
                    condicion=paciente.pendientes.filter(causa='CONDICIÓN CLÍNICA').count() + condicion
                    countP=internas+externas+condicion
            
            
                
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

        if countP!=0:
            internas=(internas*100)/countP
            externas=(externas*100)/countP
            condicion=(condicion*100)/countP
       
        print("-------------FIN----------------")
        now = datetime.now()
        fecha=str(now.year) +'-'+str(now.month)+'-'+str(now.day) 
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
    
    print("fin")
    


if __name__=='__main__':
    print(" ")