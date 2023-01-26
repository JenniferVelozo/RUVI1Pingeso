from enum import unique
from pickle import TRUE
from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser



# Create your models here.


class Permisos(models.Model):
    nombre = models.TextField(null=True)
    class Meta:
        verbose_name='Permiso'
        verbose_name_plural='Permisos'
        db_table='permiso'


class Roles(models.Model):
    id=models.IntegerField(primary_key=True)
    nombre = models.TextField(null=True)
    permisos = models.ManyToManyField(Permisos)
    class Meta:
        verbose_name='Rol'
        verbose_name_plural='Roles'
        db_table='rol'


class Servicio(models.Model):
    id=models.IntegerField(primary_key=True)
    nombre = models.TextField(null=True)
    class Meta:
        verbose_name='Servicio'
        verbose_name_plural='Servicios'
        db_table='servicio'


class Usuarios(models.Model):
    nombre = models.TextField(null=True)
    apellido = models.TextField(null=True)
    nickname = models.TextField(null=True)
    password = models.TextField(null=True)
    rut = models.TextField(null=True)
    servicio= models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, null=True, on_delete=models.CASCADE)
    class Meta:
        verbose_name='Usuario'
        verbose_name_plural='Usuarios'
        db_table='usuario'


class Cie10(models.Model):
    id=models.IntegerField(primary_key=True)
    codigo = models.TextField(null=True)
    diagnostico = models.TextField(null=True)
    grd = models.TextField(null=True)
    sev = models.TextField(null=True)
    class Meta:
        verbose_name='Cie10'
        verbose_name_plural='Cie10s'
        db_table='cie10'


class Norma(models.Model):
    id=models.IntegerField(primary_key=True)
    ir_grd = models.TextField(null=True)
    nombreGRD = models.TextField(null=True)
    emInlier = models.FloatField()
    pcSuperior = models.SmallIntegerField()
    pesoGRD = models.FloatField()
    class Meta:
        verbose_name='Norma'
        verbose_name_plural='Normas'
        db_table='norma'

class Pacientes(models.Model):
    rut = models.TextField(null=True)
    nombre = models.TextField(null=True)
    apellidoPaterno = models.TextField(null=True)
    apellidoMaterno = models.TextField(null=True)
    fechaCarga = models.DateField(auto_now_add=True)
    ultimaCama = models.TextField(null=True)
    diasEstancia = models.IntegerField(null=True)
    servicio=models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    fechaIngreso = models.DateField(null=True)
    diagnosticoPricipal= models.TextField(null=True)
    diagnosticoSecundario= models.TextField(null=True)
    class Meta:
        verbose_name='Paciente'
        verbose_name_plural='Pacientes'
        db_table='paciente'

class ReporteMensual(models.Model):
    fecha = models.DateField()
    servicioNombre= models.TextField(null=True)
    servicio = models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    em=models.FloatField()
    emaf = models.FloatField()
    iema = models.FloatField()
    peso = models.FloatField()
    iemainliersMenor = models.FloatField()
    iemainliersMayor = models.FloatField()
    outliers = models.FloatField()
    pInt = models.FloatField()
    pExt = models.FloatField()
    condP = models.FloatField()
    class Meta:
        verbose_name='ReporteMensual'
        verbose_name_plural='ReportesMensuales'
        db_table='reporteMensual'

class Pendientes(models.Model):
    id=models.IntegerField(primary_key=True)
    nombrePendiente = models.TextField(null=True)
    causa = models.TextField(null=True)
    class Meta:
        verbose_name='Pendiente'
        verbose_name_plural='Pendientes'
        db_table='pendiente'

class Resumen(models.Model):
    cama = models.TextField(null=True)
    rut = models.TextField(null=True)
    nombrePaciente = models.TextField(null=True)
    estancia = models.TextField(null=True)
    criterio =models.FloatField(null=True)
    diagnostico1 = models.TextField( null=True)
    diagnostico1Cod=models.TextField(null=True)
    diagnostico2 = models.TextField( null=True)
    diagnostico2Cod=models.TextField( null=True)
    diagnostico2Json=models.JSONField(null=True)
    ir_grd = models.TextField(null=True, max_length=10)
    emNorma = models.FloatField(null=True)
    pcSuperior = models.IntegerField(null=True)
    pesoGRD = models.FloatField(null=True)
    nombreServicio=models.TextField(null=True)
    servicio=models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    flag_diag=models.BooleanField(null=True)
    pendientes=models.ManyToManyField(Pendientes)
    flag_pend=models.BooleanField(null=True)
    pendientesJson=models.JSONField(null=True)
    updated_at=models.DateTimeField(null=True)
    class Meta:
        verbose_name='Resumen'
        verbose_name_plural='Resumenes'
        db_table='resumen'


class Historico(models.Model):

    fecha=models.DateField(null=True)#fecha en la que se carga el historico
    cama = models.TextField(null=True)
    rut = models.TextField(null=True)
    nombrePaciente = models.TextField(null=True)
    estancia = models.TextField(null=True)
    criterio =models.FloatField(null=True)
    diagnostico1 = models.TextField(null=True)
    diagnostico1Cod=models.TextField(null=True)
    diagnostico2 = models.TextField(null=True)
    diagnostico2Cod=models.TextField(null=True)
    ir_grd = models.TextField(null=True, max_length=10)
    emNorma = models.FloatField(null=True)
    pcSuperior = models.IntegerField(null=True)
    pesoGRD = models.FloatField(null=True)
    nombreServicio=models.TextField(null=True)
    servicio=models.ForeignKey(Servicio, null=True, on_delete=models.CASCADE)
    flag_diag=models.BooleanField(null=True)
    pendientes=models.ManyToManyField(Pendientes)
    flag_pend=models.BooleanField(null=True)
    pendientesJson=models.JSONField(null=True)
    class Meta:
        verbose_name='Historico'
        verbose_name_plural='Historicos'
        db_table='historico'


#----------- LOGIN --------------------

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




