# Generated by Django 4.1.2 on 2022-10-13 04:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionPacientes', '0020_alter_pacientes_apellidomaterno_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resumen',
            name='emNorma',
            field=models.FloatField(null=True),
        ),
    ]
