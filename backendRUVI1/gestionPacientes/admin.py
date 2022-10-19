from django.contrib import admin
from gestionPacientes.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'nickname', 'nombre', 'apellido', 'rut', 'servicio', 'rol', 'is_admin')
  list_filter = ('is_admin',)
  fieldsets = (
      ('User Credentials', {'fields': ('nickname', 'password')}),
      ('Personal info', {'fields': ('nombre', 'apellido', 'rut', 'servicio', 'rol')}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('nickname', 'nombre', 'apellido', 'rut', 'servicio', 'rol', 'password1', 'password2'),
      }),
  )
  search_fields = ('nickname',)
  ordering = ('nickname', 'id')
  filter_horizontal = ()


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)