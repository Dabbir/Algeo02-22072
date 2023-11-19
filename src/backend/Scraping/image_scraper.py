from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import shutil
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

app = Flask(__name__)

CORS(app)

def download_image(url, folder_path):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check for errors
        file_name = os.path.join(folder_path, os.path.basename(urlparse(url).path))

        with open(file_name, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)

        print(f"Downloaded: {file_name}")
        return file_name  # Return the downloaded file path
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def scrape_images(url, folder_path):
    downloaded_files = []
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for errors
        soup = BeautifulSoup(response.text, 'html.parser')

        for img_tag in soup.find_all('img'):
            img_url = urljoin(url, img_tag['src'])
            file_path = download_image(img_url, folder_path)
            if file_path:
                downloaded_files.append(file_path)
    except Exception as e:
        print(f"Error scraping images from {url}: {e}")

    return downloaded_files

@app.route('/api/scrape', methods=['POST'])
def scrape_endpoint():
    data = request.get_json()
    web_url = data.get('url')
    output_folder = "images"

    # Auto update folder if new scrape
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)

    os.makedirs(output_folder)
    downloaded_files = scrape_images(web_url, output_folder)

    if not downloaded_files:
        return jsonify({"message": "Tidak didapatkan image."}), 404

    # Send the list of downloaded image URLs in the response
    image_urls = [os.path.relpath(file_path, output_folder) for file_path in downloaded_files]
    return jsonify({"message": "Scraping success.", "images": image_urls}), 200

if __name__ == "__main__":
    app.run(debug=True)
