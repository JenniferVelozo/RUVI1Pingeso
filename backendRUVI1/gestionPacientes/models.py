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
    diagnostico = models.CharField(max_length = 50)
    grd = models.CharField(max_length = 10)
    sev = models.CharField(max_length = 3)
    class Meta:
        verbose_name='Cie10'
        verbose_name_plural='Cie10s'
        db_table='cie10'


class Norma(models.Model):
    ir_grd = models.CharField(max_length = 10)
    nombregrd = models.CharField(max_length = 50)
    numaltash = models.SmallIntegerField() # creo, preguntar
    sumaestancia = models.IntegerField( )
    eminlier = models.FloatField()
    pcsuperior = models.SmallIntegerField()
    pesogrd = models.FloatField()
    preciofonasa = models.FloatField()
    class Meta:
        verbose_name='Norma'
        verbose_name_plural='Normas'
        db_table='norma'


