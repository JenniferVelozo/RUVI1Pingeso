# Generated by Django 4.1.1 on 2022-10-12 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionPacientes', '0014_alter_resumen_diagnostico1_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resumen',
            name='nombrePaciente',
            field=models.CharField(max_length=200),
        ),
    ]