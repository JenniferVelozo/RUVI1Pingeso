
from sqlalchemy import create_engine
import sqlalchemy as sqlalchemy

def conectar(username, password, host, port, database):
    conn = 'postgresql://'+ username +':'+ password + '@' + host +':'+ port+'/'+ database
    # 'postgresql://postgres:postgres@admin:5432/RUVI1'
    # Conexión a base de datos local
    engine = create_engine(conn)
    return engine


def conectar_db():
    conn = conectar('postgres', 'admin', '127.0.0.1', '5432', 'RUVI1')
    return conn

def close_session_db(conn):
    conn.execute("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = 'RUVI1' AND pid <> pg_backend_pid();")
