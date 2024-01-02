from flask import Flask, request, jsonify, send_from_directory, render_template
from pymongo import MongoClient 
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import os

app = Flask(__name__) 
CORS(app)

# Konfigurasi untuk file upload
UPLOAD_FOLDER = r'C:/codingan/github pribadi/maps/maps/api/api/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_error(e):
    return jsonify({'error': str(e)})

@app.route('/') 
def hello_world():  
    return 'ye bisa'

client = MongoClient("mongodb+srv://tes:tes@cluster1.tbcoubt.mongodb.net/?retryWrites=true&w=majority") 

db = client['mydb'] 

collection = db['pengguna'] 

# @app.route('/add_data', methods=['POST']) 
# def add_data(): 
#     data = request.form
#     file = request.files['file']

#     if 'nama' not in data or 'lokasi' not in data or 'status' not in data or file is None or not allowed_file(file.filename):
#         return jsonify({'error': 'Semua data (termasuk file) harus diisi dan file harus berupa gambar'}), 400

#     # Simpan file di server
#     filename = secure_filename(file.filename)
#     file.save(os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename)))

#     # Buat dictionary untuk disimpan ke MongoDB
#     filtered_data = {'nama': data['nama'], 'nik': data['nik'], 'status': data['status'], 'lokasi': data['lokasi'], 'file_path': filename}

#     # Insert data ke MongoDB
#     collection.insert_one(filtered_data) 

#     return 'Data added to MongoDB'

# @app.route('/get_data', methods=['GET']) 
# def get_data(): 
#     data = list(collection.find()) 

#     for entry in data:
#         entry['_id'] = str(entry['_id'])

#     return jsonify(data)


# @app.route('/uploads/<filename>')

# def uploaded_file(filename):

#     print("Request for file:", filename)

#     try:

#         return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#     except Exception as e:

#         print("Error sending file:", str(e))

#         return "Error sending file", 500  # Internal Server Error
    
def ensure_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def save_to_file(data):
    clean_data = {key: value.replace('\\', '') if isinstance(value, str) else value for key, value in data.items()}

    with open('kamu.txt', 'a') as file:
        json_data = json.dumps(clean_data, default=str, ensure_ascii=False)
        file.write(json_data + '\n')

@app.route('/save_data', methods=['POST'])
def save_data():
    try:
        data = request.form.to_dict()

        data['coordinates'] = json.loads(data['coordinates'])

        ensure_upload_folder()

        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename != '':
                image_extension = os.path.splitext(image_file.filename)[1]
                image_filename = f"{data['firstName']}_{data['lastName']}_photo{image_extension}"
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(image_filename))
                image_file.save(image_path)
                data['image'] = image_path

        save_to_file(data)
        return jsonify({"message": "Data saved successfully"})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('name')
    password = data.get('password')

    # Bandingkan data dengan input pengguna
    if username == 'admin' and password == 'admin':
        user_data = {'name': 'admin', 'email': 'admin@example.com'}
        return jsonify(user_data)
    else:
        return jsonify({'error': 'Login failed. Check your username and password.'}), 401

@app.route('/get_multipolygon', methods=['GET'])
def get_multipolygon():
    multi_polygon = [
        [-6.955594410086734, 107.63432129269165],
        [-6.95604058679135, 107.63654424977625],
        [-6.960455407673797, 107.63564295935879],
        [-6.959973454096144, 107.6333973753033]
    ]
    return jsonify({'multiPolygon': multi_polygon})

if __name__ == '__main__': 
    app.run()