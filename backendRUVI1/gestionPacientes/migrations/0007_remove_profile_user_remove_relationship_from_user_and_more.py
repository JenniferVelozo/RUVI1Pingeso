# Generated by Django 4.1.1 on 2022-10-12 00:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionPacientes', '0006_remove_profile_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='user',
        ),
        migrations.RemoveField(
            model_name='relationship',
            name='from_user',
        ),
        migrations.RemoveField(
            model_name='relationship',
            name='to_user',
        ),
        migrations.AlterField(
            model_name='resumen',
            name='rut',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.DeleteModel(
            name='Post',
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
        migrations.DeleteModel(
            name='Relationship',
        ),
    ]
