# Generated by Django 4.1.1 on 2022-10-12 21:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gestionPacientes', '0018_alter_resumen_ir_grd'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resumen',
            name='pago',
        ),
    ]
