import mysql.connector
from mysql.connector import Error

def create_connection():
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host='localhost',  # bind to all interfaces
            user='root',  # replace with your MySQL username
            password='MitsuSQL5847',  # replace with your MySQL password
            database='task_manager'  # database name
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# Example usage
if __name__ == "__main__":
    conn = create_connection()
    if conn:
        conn.close()