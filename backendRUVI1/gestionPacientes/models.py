from enum import unique
from pickle import TRUE
from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser



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
    rut = models.CharField(max_length = 10, null=True)
    nombre = models.CharField(max_length=75, null=True)
    apellidoPaterno = models.CharField(max_length=75, null=True)
    apellidoMaterno = models.CharField(max_length=75, null=True)
    fechaCarga = models.DateField(null=True)
    ultimaCama = models.CharField(max_length=75,null=True)
    diasEstancia = models.IntegerField(null=True)
    servicio=models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    fechaIngreso = models.DateField(null=True)
    diagnosticoPricipal= models.CharField(max_length=250, null=True)
    diagnosticoSecundario= models.CharField(max_length=250, null=True)
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
    cama = models.CharField(max_length=10,null=True)
    rut = models.CharField(max_length=30,null=True)
    nombrePaciente = models.CharField(max_length=200)
    estancia = models.CharField(max_length=10,null=True)
    criterio =models.FloatField(null=True)
    diagnostico1 = models.CharField(max_length=250, null=True)
    diagnostico2 = models.CharField(max_length=500, null=True)
    ir_grd = models.CharField(null=True, max_length=10)
    emNorma = models.FloatField(null=True)
    pcSuperior = models.IntegerField(null=True)
    pesoGRD = models.FloatField(null=True)
    nombreServicio=models.CharField(max_length=75, null=True)
    servicio=models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    flag_diag=models.BooleanField(null=True)
    class Meta:
        verbose_name='Resumen'
        verbose_name_plural='Resumenes'
        db_table='resumen'





#----------- INTENTO DE LOGIN --------------------

#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, nickname, nombre, apellido, rut, servicio, rol, password=None, password2=None):
      """
      Creates and saves a User 
      """
      if not nickname:
          raise ValueError('El usuario debe tener un nickname')

      user = self.model(
          nickname=nickname,
          nombre = nombre,
          apellido = apellido, 
          rut = rut,
          servicio = servicio,
          rol = rol, 
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, nickname, nombre, apellido, rut, servicio, rol, password=None):
      """
      Creates and saves a superuser 
      """
      user = self.create_user(
          nickname=nickname,
          password= password,
          nombre = nombre,
          apellido = apellido, 
          rut = rut,
          servicio = servicio,
          rol = rol, 
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    nickname = models.CharField(max_length = 20, unique = True)
    password = models.CharField(max_length = 100)
    rut = models.CharField(max_length = 20)
    servicio= models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, null=True, on_delete=models.CASCADE)
    class Meta:
        verbose_name='User'
        verbose_name_plural='Users'
        db_table='user'

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'nickname'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'rut', 'password', 'servicio', 'rol']

    def __str__(self):
        return self.nickname

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin




