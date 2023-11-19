import os
import cv2
from flask import Flask, jsonify
from flask_cors import CORS
from CBIR.color import process_image_color, process_images_color, cosine_similarity
from CBIR.tekstur import process_image_texture, process_images_texture, cos
from glob import glob
import time

app = Flask(__name__)
CORS(app)

def get_latest_image(folder_path):
    files = os.listdir(folder_path)
    image_files = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg'))]
    sorted_files = sorted(image_files, key=lambda x: os.path.getmtime(os.path.join(folder_path, x)), reverse=True)
    return os.path.join(folder_path, sorted_files[0]) if sorted_files else None

def process_images(process_func, image_paths):
    return [process_func(cv2.imread(image_path)) for image_path in image_paths]

@app.route('/api/process_image', methods=['GET'])
def process_image():
    try:
        latest_uploaded_image = get_latest_image(os.path.join('api', 'public', 'uploads'))

        if latest_uploaded_image:
            uploaded_image = cv2.imread(latest_uploaded_image)
            start = time.time()

            processed_upload_color = process_image_color(uploaded_image)
            time_of_color_process = time.time() - start

            start = time.time()
            processed_upload_texture = process_image_texture(uploaded_image)
            time_of_texture_process = time.time() - start

            image_paths = glob(os.path.join('api', 'public', 'dataset', '*.*'))

            start = time.time()
            processed_images_color = process_images(process_image_color, image_paths)
            time_of_color_batch_process = time.time() - start

            start = time.time()
            processed_images_texture = process_images(process_image_texture, image_paths)
            time_of_texture_batch_process = time.time() - start

            start = time.time()
            results_color = cosine_similarity_batch(processed_upload_color, processed_images_color)
            time_of_color_similarity = time.time() - start

            start = time.time()
            results_texture = cos_batch(processed_upload_texture, processed_images_texture)
            time_of_texture_similarity = time.time() - start

            results = [
                {
                    "image_path": image_paths[i],
                    "similarity_color": results_color[i],
                    "similarity_texture": results_texture[i]
                } for i in range(len(image_paths))
            ]

            end = time.time()

            response_data = {
                "status": "success",
                "results": results,
                "time_of_color_process": time_of_color_process,
                "time_of_texture_process": time_of_texture_process,
                "time_of_color_similarity": time_of_color_similarity,
                "time_of_texture_similarity": time_of_texture_similarity,
                "time": end - start
            }
            return jsonify(response_data)
        else:
            error_message = {"status": "error", "message": "No uploaded images found"}
            return jsonify(error_message)

    except Exception as e:
        error_message = {"status": "error", "message": str(e)}
        return jsonify(error_message)

def cosine_similarity_batch(processed_upload, processed_images):
    return [cosine_similarity(processed_upload, img) for img in processed_images]

def cos_batch(processed_upload, processed_images):
    return [cos(processed_upload, img) for img in processed_images]

if __name__ == "__main__":
    app.run(debug=True, port=8080)
