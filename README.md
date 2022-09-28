# RUVI1Pingeso

Hay que crear una base de datos con el nombre "RUVI1" en postgres

Las entidades se crean en el archivo models.py
python manage.py check gestionPacientes
python manage.oy makemigrations  -> esto crea los archivos en la carpeta migrations. Luego de ejecutar este comando aparece un nro, como 0001_initial.py
python manage.py sqlmigrate gestionPacientes 0001  (el nro que se menciona arriba)
python manage.py migrate  (se migra todo a la base de datos)