from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient 
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json
import os

app = Flask(__name__) 
CORS(app)
saved_file_data = {}

# link fikri 'C:/Users/Lakuna/OneDrive/Documents/GitHub/tubes_pbo_maps/uploads'
# link darell 'C:/Users/ryand/Documents/GitHub/tubes_pbo_maps/uploads'

UPLOAD_FOLDER = r'C:/Users/Lakuna/OneDrive/Documents/GitHub/tubes_pbo_maps/uploads'
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
        ttl = request.form['ttl']
        state = request.form['state']
        zip_code = request.form['zip']
        country = request.form['country']

        # Validasi data
        if not name or not nik or not ttl or not state or not country:
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
        print("TTL:", ttl)
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
        search_query = request.args.get('search')
        with open('Warga.txt', 'r') as file:
            saved_data = [json.loads(line.strip()) for line in file]

        # Tambahkan URL foto ke setiap data yang diambil
        if search_query:
            saved_data = [data for data in saved_data if data.get('name', '').lower().startswith(search_query.lower())]
            
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
        name = data.get('nama')
        file_name = data.get('fileName')

        # Baca data file Riwayat_surat.txt
        with open('Riwayat_surat.txt', 'r') as history_file:
            history_data = [json.loads(line.strip()) for line in history_file]

        # Temukan entri yang sesuai dengan nama
        entry_found = False
        for entry in history_data:
            if entry['nama'] == name:
                entry_found = True
                entry['fileNames'].append(file_name)
                break

        # Jika entri tidak ditemukan, tambahkan entri baru
        if not entry_found:
            history_data.append({'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'nama': name, 'fileNames': [file_name]})

        # Tulis kembali data ke dalam file Riwayat_surat.txt
        with open('Riwayat_surat.txt', 'w') as history_file:
            for entry in history_data:
                json_data = json.dumps(entry, default=str, ensure_ascii=False)
                history_file.write(json_data + '\n')

        return jsonify({"message": "File name saved successfully"})
    except Exception as e:
        return handle_error(e)




@app.route('/get_saved_file_name', methods=['GET'])
def get_saved_file_name():
    try:
        with open('Riwayat_surat.txt', 'r') as history_file:
            history_data = [json.loads(line.strip()) for line in history_file]

        result_data = []

        for entry in history_data:
            result_entry = {
                "timestamp": entry["timestamp"],
                "nama": entry["nama"],
                "fileNames": entry["fileNames"]
            }
            result_data.append(result_entry)

        return jsonify({'history': result_data})
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
        [-7.004907588975661, 107.6361829016956],
        [-7.005636781043971, 107.63607150547568],
        [-7.005870158815059, 107.63695591129958],
        [-7.005611151796026, 107.6370264065953],
        [-7.005611151795504, 107.637238419831],
        [-7.005373857896837, 107.6372970617887],
        [-7.005280295178104, 107.6370170686941],
        [-7.00521107833573, 107.6370197509031],
        [-7.005203091776328, 107.63696610672356],
        [-7.005453337239119, 107.63689100487228],
        [-7.005328214520942, 107.6362606857531],
        [-7.004907588975661, 107.63630360109948]

    ]
    return jsonify({'multiPolygon': multi_polygon})

if __name__ == '__main__': 
    app.run()