# Generated by Django 4.1.1 on 2022-10-12 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionPacientes', '0013_alter_resumen_cama'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resumen',
            name='diagnostico1',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='diagnostico2',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='emNorma',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='estancia',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='pago',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='pcSuperior',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='resumen',
            name='pesoGRD',
            field=models.FloatField(null=True),
        ),
    ]
