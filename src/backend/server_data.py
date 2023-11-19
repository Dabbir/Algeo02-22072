from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import shutil
import zipfile
from io import BytesIO
import requests

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'public/uploads'
DATASET_FOLDER = 'public/dataset'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DATASET_FOLDER'] = DATASET_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'photo' not in request.files:
        return jsonify({"status": "error", "message": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({"status": "success", "image": filename, "destination": UPLOAD_FOLDER})
    else:
        return jsonify({"status": "error", "message": "Invalid file format"})

@app.route('/api/upload/dataset', methods=['POST'])
def upload_dataset():
    if 'files' not in request.files:
        return jsonify({"status": "error", "message": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"})

    if file and file.filename.endswith('.zip'):
        zip_filepath = os.path.join(app.config['DATASET_FOLDER'], 'temp.zip')
        file.save(zip_filepath)
        
        with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
            zip_ref.extractall(app.config['DATASET_FOLDER'])
        
        os.remove(zip_filepath)

        return jsonify({"status": "success", "message": "Dataset uploaded", "destination": DATASET_FOLDER})
    else:
        return jsonify({"status": "error", "message": "Invalid file format. Please upload a zip file"})

if __name__ == '__main__':
    app.run(debug=True)
