from django.db import models

# Create your models here.


class Permisos(models.Model):
    nombre = models.CharField(max_length = 40)
    class Meta:
        verbose_name='Permiso'
        verbose_name_plural='Permisos'
        db_table='permiso'


class Roles(models.Model):
    nombre = models.CharField(max_length = 20)
    permisos = models.ManyToManyField(Permisos)
    class Meta:
        verbose_name='Rol'
        verbose_name_plural='Roles'
        db_table='rol'


class Servicio(models.Model):
    nombre = models.CharField(max_length = 50)
    class Meta:
        verbose_name='Servicio'
        verbose_name_plural='Servicios'
        db_table='servicio'


class Usuarios(models.Model):
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    nickname = models.CharField(max_length = 20)
    password = models.CharField(max_length = 20)
    rut = models.CharField(max_length = 10)
    servicio= models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, null=True, on_delete=models.CASCADE)
    class Meta:
        verbose_name='Usuario'
        verbose_name_plural='Usuarios'
        db_table='usuario'


class Cie10(models.Model):
    codigo = models.CharField(max_length = 7)
    diagnostico = models.CharField(max_length = 250)
    grd = models.CharField(max_length = 10)
    sev = models.CharField(max_length = 3)
    class Meta:
        verbose_name='Cie10'
        verbose_name_plural='Cie10s'
        db_table='cie10'


class Norma(models.Model):
    ir_grd = models.CharField(max_length = 10)
    nombreGRD = models.CharField(max_length = 150)
    emInlier = models.FloatField()
    pcSuperior = models.SmallIntegerField()
    pesoGRD = models.FloatField()
    class Meta:
        verbose_name='Norma'
        verbose_name_plural='Normas'
        db_table='norma'

class Pacientes(models.Model):
    rut = models.CharField(max_length = 10)
    nombre = models.CharField(max_length=30)
    apellidoPaterno = models.CharField(max_length=30)
    apellidoMaterno = models.CharField(max_length=30)
    fechaCarga = models.DateField()
    ultimaCama = models.IntegerField()
    diasEstancia = models.IntegerField()
    servicio= models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    fechaIngreso = models.DateField()
    diagnosticos= models.CharField(max_length=250, null=True)
    class Meta:
        verbose_name='Paciente'
        verbose_name_plural='Pacientes'
        db_table='paciente'

class ReporteMensual(models.Model):
    fecha = models.DateField()
    condP = models.FloatField()
    servicio = models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    emaf = models.FloatField()
    iema = models.FloatField()
    peso = models.FloatField()
    emafInliers = models.FloatField()
    iemaInliers = models.FloatField()
    outliers = models.FloatField()
    pInt = models.FloatField()
    pExt = models.FloatField()

    class Meta:
        verbose_name='ReporteMensual'
        verbose_name_plural='ReportesMensuales'
        db_table='reporteMensual'

class Pendientes(models.Model):
    nombrePendiente = models.CharField(max_length=30)
    causa = models.CharField(max_length=40, null=True)
    class Meta:
        verbose_name='Pendiente'
        verbose_name_plural='Pendientes'
        db_table='pendiente'

class Resumen(models.Model):
    cama = models.IntegerField()
    rut = models.CharField(max_length=30,null=True)
    nombrePaciente = models.CharField(max_length=30)
    estancia = models.IntegerField()
    diagnostico1 = models.CharField(max_length=250)
    diagnostico2 = models.CharField(max_length=250)
    ir_grd = models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    emNorma = models.IntegerField()
    pcSuperior = models.IntegerField()
    pesoGRD = models.FloatField()
    pago = models.FloatField()

    class Meta:
        verbose_name='Resumen'
        verbose_name_plural='Resumenes'
        db_table='resumen'









