from flask import Flask, request, jsonify, send_from_directory

from pymongo import MongoClient 

from flask_cors import CORS

from werkzeug.utils import secure_filename

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

@app.route('/add_data', methods=['POST']) 
def add_data(): 
    data = request.form
    file = request.files['file']

    if 'nama' not in data or 'lokasi' not in data or 'status' not in data or file is None or not allowed_file(file.filename):
        return jsonify({'error': 'Semua data (termasuk file) harus diisi dan file harus berupa gambar'}), 400

    # Simpan file di server
    filename = secure_filename(file.filename)
    file.save(os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename)))

    # Buat dictionary untuk disimpan ke MongoDB
    filtered_data = {'nama': data['nama'], 'nik': data['nik'], 'status': data['status'], 'lokasi': data['lokasi'], 'file_path': filename}

    # Insert data ke MongoDB
    collection.insert_one(filtered_data) 

    return 'Data added to MongoDB'

@app.route('/get_data', methods=['GET']) 
def get_data(): 
    data = list(collection.find()) 

    for entry in data:
        entry['_id'] = str(entry['_id'])

    return jsonify(data)


@app.route('/uploads/<filename>')

def uploaded_file(filename):

    print("Request for file:", filename)

    try:

        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    except Exception as e:

        print("Error sending file:", str(e))

        return "Error sending file", 500  # Internal Server Error


if __name__ == '__main__': 
    app.run()