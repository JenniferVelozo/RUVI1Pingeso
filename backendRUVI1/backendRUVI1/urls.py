"""backendRUVI1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from gestionPacientes.views import  *


from rest_framework.routers import DefaultRouter
from gestionPacientes.views import *
from exp_resumen import *


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'rol', RolViewSet)
router.register(r'pendientes', PendienteViewSet)
router.register(r'resumen', ResumenViewSet)
router.register(r'historico', HistoricoViewSet)
router.register(r'historicoDates', HistoricoDatesViewSet)
urlpatterns = router.urls

urlpatterns += [
    path('admin/', admin.site.urls),
    path('login/', comprobar),
    path('api/user/', include('gestionPacientes.urls')), # parte del intento de login
    path('subir/', subir),
    path('exportar/', resumen_to_excel),
    path('setPendientes/', setPendientes),
    path('setDiagnosticos/',setDiagnostico),
    path('historico/<fecha>/<id_servicio>/<id_pendiente>', filtarServicioPendiente),
    path('resumen/pendientes/<id_paciente>', filtrarPendientesPorPaciente)
]
