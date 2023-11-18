from flask import Flask, request, jsonify
import os
import requests
import shutil
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

app = Flask(__name__)

def download_image(url, folder_path):
    try:
        test = requests.get(url, stream=True)
        file_name = os.path.join(folder_path, os.path.basename(urlparse(url).path))

        with open(file_name, 'wb') as file:
            for chunk in test.iter_content(chunk_size=128):
                file.write(chunk)

        print(f"Downloaded: {file_name}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def scrape_images(url, folder_path):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        for img_tag in soup.find_all('img'):
            img_url = urljoin(url, img_tag['src'])
            download_image(img_url, folder_path)
    except Exception as e:
        print(f"Error scraping images from {url}: {e}")

@app.route('/api/scrape', methods=['POST'])
def scrape_endpoint():
    data = request.get_json()
    web_url = data.get('url')
    output_folder = "/../api/public/dataset"

    # Auto update folder if new scrape
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)

    os.makedirs(output_folder)
    scrape_images(web_url, output_folder)

    if not os.listdir(output_folder):
        return jsonify({"message": "Tidak didapatkan image."}), 404

    return jsonify({"message": "Scraping success."}), 200

if __name__ == "__main__":
    app.run(debug=True)
