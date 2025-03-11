from db_connection import create_connection
def create_task(title, description, category):
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute('INSERT INTO tasks (title, description, category) VALUES (%s, %s, %s)', 
                       (title, description, category))
        connection.commit()
        cursor.close()
        connection.close()
def get_tasks():
    """Get a list of tasks."""
    connection = create_connection()
    tasks = []
    if connection:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM tasks')
        tasks = cursor.fetchall()
        cursor.close()
        connection.close()
    return tasks