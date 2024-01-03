from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient 
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import os

app = Flask(__name__) 
CORS(app)
saved_file_data = {}

UPLOAD_FOLDER = r'C:/Users/Lakuna/OneDrive/Documents/GitHub/tubes_pbo_maps/api/api/uploads'
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

def ensure_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def save_to_file(data):
    clean_data = {key: value.replace('\\', '') if isinstance(value, str) else value for key, value in data.items()}

    with open('Warga.txt', 'a') as file:
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
                image_filename = f"{data['name']}_photo{image_extension}"
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(image_filename))
                image_file.save(image_path)
                data['image'] = image_path

        # Terima data dari form
        name = request.form['name']
        nik = request.form['nik']
        address = request.form['address']
        city = request.form['city']
        state = request.form['state']
        zip_code = request.form['zip']
        country = request.form['country']

        # Validasi data
        if not name or not nik or not city or not state or not country:
            return jsonify({"error": "Semua kolom wajib diisi"}), 400

        if not nik.isdigit() or len(nik) != 16:
            return jsonify({"error": "NIK harus berupa 16 digit angka"}), 400


        if 'image' in request.files:
            image = request.files['image']
            if image.filename != '':
                filename = secure_filename(image.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                image.save(filepath)
        else:
            filename = None

        print("Name:", name)
        print("NIK:", nik)
        print("Address:", address)
        print("City:", city)
        print("State:", state)
        print("Zip Code:", zip_code)
        print("Country:", country)
        if filename:
            print("Image Filename:", filename)


        save_to_file(data)

        return jsonify({"message": "Data saved successfully"})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
    


@app.route('/get_saved_data', methods=['GET'])
def get_saved_data():
    try:
        with open('Warga.txt', 'r') as file:
            saved_data = [json.loads(line.strip()) for line in file]

        # Tambahkan URL foto ke setiap data yang diambil
        for data in saved_data:
            if 'image' in data:
                data['image_url'] = f'http://127.0.0.1:5000/get_photo/{os.path.basename(data["image"])}'

            # Check if the name exists in the saved_file_data dictionary
            if data['name'] in saved_file_data:
                data['fileName'] = saved_file_data[data['name']]['fileName']

        return jsonify({'savedData': saved_data})
    except Exception as e:
        return handle_error(e)

    
@app.route('/delete_data/<name>', methods=['DELETE'])
def delete_data(name):
    try:
        with open('Warga.txt', 'r') as file:
            saved_data = [json.loads(line.strip()) for line in file]

        updated_data = [data for data in saved_data if data.get('name') != name]

        with open('Warga.txt', 'w') as file:
            for data in updated_data:
                json_data = json.dumps(data, default=str, ensure_ascii=False)
                file.write(json_data + '\n')

        return jsonify({"message": "Data deleted successfully"})
    except Exception as e:
        return handle_error(e)


@app.route('/get_photo/uploads<filename>', methods=['GET'])
def get_photo(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return handle_error(e)
    

@app.route('/save_file_name', methods=['POST'])
def save_file_name():
    try:
        data = request.get_json()
        nama = data.get('nama')  # Retrieve the "nama" value
        fileName = data.get('fileName')

        # Save the data in the saved_file_data dictionary
        saved_file_data[nama] = {'fileName': fileName}

        return jsonify({"message": "File name saved successfully"})
    except Exception as e:
        return handle_error(e)


@app.route('/get_saved_file_name', methods=['GET'])
def get_saved_file_name():
    try:
        global saved_file_data
        return jsonify(saved_file_data)
    except Exception as e:
        return handle_error(e)



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