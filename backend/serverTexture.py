import os
import cv2
from flask import Flask, jsonify, request
from flask_cors import CORS
from CBIR.tekstur import process_image_texture, process_images_texture, cos
from glob import glob
import time

app = Flask(__name__)
CORS(app)

def get_latest_image(folder_path):
    # Get a list of files in the folder
    files = os.listdir(folder_path)

    # Filter only image files
    image_files = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sort the image files based on modification time
    sorted_files = sorted(image_files, key=lambda x: os.path.getmtime(os.path.join(folder_path, x)), reverse=True)

    if sorted_files:
        # Return the path to the latest image
        return os.path.join(folder_path, sorted_files[0])
    else:
        return None

@app.route('/api/process_image', methods=['GET'])
def process_image():
    try:

        # Get the path to the latest uploaded image
        latest_uploaded_image = get_latest_image(os.path.join('api', 'public', 'uploads'))

        if latest_uploaded_image:
            uploaded_image = cv2.imread(latest_uploaded_image)
            processed_upload = process_image_texture(uploaded_image)

            # Use glob to get a list of image paths
            image_paths = glob(os.path.join('api', 'public', 'dataset', '*.jpg'))
            images = process_images_texture(image_paths)
            print(images)

            start = time.time()
            results = []
            for i in range(len(images)):
                similarity = cos(images[i], processed_upload)
                results.append({"image_path": image_paths[i], "similarity": similarity})
            end = time.time()

            response_data = {"status": "success", "results": results, "time": end - start}
            # print("JSON Response:", response_data)

            return jsonify(response_data)
        else:
            error_message = {"status": "error", "message": "No uploaded images found"}
            print("JSON Response:", error_message)
            return jsonify(error_message)

    except Exception as e:
        error_message = {"status": "error", "message": str(e)}
        print("JSON Response:", error_message)
        return jsonify(error_message)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
