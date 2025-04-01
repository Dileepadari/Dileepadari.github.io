from flask import Flask, request, jsonify
import sqlite3
import datetime
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS
CORS(app)
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    conn.execute("PRAGMA journal_mode = OFF")
    return conn

# Create users table if not exists
conn = get_db_connection()
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                    uniqueid INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    created_date TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE
                )''')
# Create task_lists table if not exists
cursor.execute('''CREATE TABLE IF NOT EXISTS task_lists (
                    list_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    list_name TEXT NOT NULL,
                    username TEXT NOT NULL,
                    num_items INTEGER DEFAULT 0,
                    FOREIGN KEY (username) REFERENCES users (username)
                )''')

# Create tasks table if not exists
cursor.execute('''CREATE TABLE IF NOT EXISTS tasks (
                    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    list_id INTEGER NOT NULL,
                    uniqueid INTEGER NOT NULL,
                    task_name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    created_date TEXT NOT NULL,
                    deadline TEXT,
                    status TEXT,
                    FOREIGN KEY (list_id) REFERENCES task_lists (list_id),
                    FOREIGN KEY (uniqueid) REFERENCES users (uniqueid)
                )''')
conn.commit()

@app.route('/create_list', methods=['POST'])
def create_list():
    list_data = request.get_json()
    # Insert task into the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO task_lists (list_name, username) VALUES (?, ?)",
                (list_data['list_name'], list_data['username']))
    conn.commit()
    return jsonify({'message': 'List created successfully'})

# Create task endpoint
@app.route('/task', methods=['POST'])
def create_task():
    task_data = request.get_json()
    print(task_data)
    # Insert task into the database
    current_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")    
    # Get uniqueid by username
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT uniqueid FROM users WHERE username=?", (task_data['uniqueid'],))
    result = cursor.fetchone()
    if result is None:
        return jsonify({'message': 'Invalid username'})
    uniqueid = result[0]
    cursor.execute("INSERT INTO tasks (list_id, uniqueid, task_name, description, created_date, deadline, status) VALUES (?, ?, ?, ?, ?, ?, 'created')",
                   (task_data['list_id'], uniqueid, task_data['task_name'], task_data['description'], current_date, task_data['deadline']))
    conn.commit()
    # Increase task count in the list
    cursor.execute("UPDATE task_lists SET num_items = num_items + 1 WHERE list_id = ?", (task_data['list_id'],))
    conn.commit()
    return jsonify({'message': 'Task created successfully'})

# Delete task_list endpoint
@app.route('/list/<list_id>', methods=['DELETE'])
def delete_list(list_id):
    # Delete list from the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM task_lists WHERE list_id=?", (list_id,))
    conn.commit()
    # Delete all tasks in the list
    cursor.execute("DELETE FROM tasks WHERE list_id=?", (list_id,))
    conn.commit()
    return jsonify({'message': 'List deleted successfully'})


# Delete task endpoint
@app.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    # Delete task from the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE task_id=?", (task_id,))
    conn.commit()
    # Decrease task count in the list
    cursor.execute("UPDATE task_lists SET num_items = num_items - 1 WHERE list_id = (SELECT list_id FROM tasks WHERE task_id=?)", (task_id,))
    conn.commit()
    return jsonify({'message': 'Task deleted successfully'})

# Update task endpoint
@app.route('/task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task_data = request.get_json()
    # Update task in the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE task_id = ?" , (task_id,))
    result = cursor.fetchone()
    task_name = task_data.get('task_name', result[3])
    deadline = task_data.get('deadline', result[6])
    status = task_data.get('status', result[7])
    cursor.execute("UPDATE tasks SET task_name=?, deadline=?, status=? WHERE task_id=?",
                     (task_name, deadline, status, task_id))
    conn.commit()
    return jsonify({'message': 'Task updated successfully'})

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    # Check if login credentials are valid
    login_data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE username=?", (login_data['username'],))
    user = cursor.fetchone()
    if user is None:
        return jsonify({'status': 403, 'message': 'Invalid username'})
    if user[3] != login_data['password']:
        return jsonify({'status': 403, 'message': 'Invalid password'})
    return jsonify({'status': 200, 'data': user})

# Signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    signup_data = request.get_json()
    # Check if user already exists
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=? or email=?" , (signup_data['username'], signup_data['email']))
    existing_user = cursor.fetchone()
    if existing_user is not None:
        return jsonify({'status': 409, 'message': 'Username already exists'})
    # Insert user into the database
    current_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO users (name, username, password, created_date, email) VALUES (?, ?, ?, ?, ?)",
                   (signup_data['name'], signup_data['username'], signup_data['password'], current_date, signup_data['email']))
    conn.commit()
    return jsonify({'status': 200, 'message': 'Signup successful'})

# Get all lists endpoint
@app.route('/lists/<username>', methods=['GET'])
def get_lists(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM task_lists WHERE username=?", (username,))
    lists = cursor.fetchall()
    return jsonify({'data': lists})

# Get all tasks endpoint
@app.route('/tasks/<listname>/<username>', methods=['GET'])
def get_tasks(listname, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    #get uniqueid by username
    cursor.execute("SELECT uniqueid FROM users WHERE username=?", (username,))
    result = cursor.fetchone()
    if result is None:
        return jsonify({'message': 'Invalid username'})
    uniqueid = result[0]
    cursor.execute("SELECT * FROM tasks WHERE uniqueid=(?) AND list_id=(SELECT list_id FROM task_lists WHERE list_name=?)", (uniqueid, listname))
    tasks = cursor.fetchall()
    return jsonify({'data': tasks})

if __name__ == '__main__':
    app.run()