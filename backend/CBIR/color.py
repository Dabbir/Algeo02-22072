import numpy as np
import math
import time
import cv2
from concurrent.futures import ThreadPoolExecutor

def rgb_to_hsv(image):
    image = image.astype(np.float32) / 255.0
    maxc = np.max(image, axis=-1)
    minc = np.min(image, axis=-1)
    v = maxc
    s = np.where(maxc == 0, 0, (maxc - minc) / (maxc + 1e-20)) # if else for s value

    rc = (maxc - image[..., 2]) / (maxc - minc + 1e-20)
    gc = (maxc - image[..., 1]) / (maxc - minc + 1e-20)
    bc = (maxc - image[..., 0]) / (maxc - minc + 1e-20)

    h = np.where(maxc == minc, 0,
                 np.where(maxc == image[..., 2], (bc - gc),
                          np.where(maxc == image[..., 1], 2.0 + (rc - bc),
                                   4.0 + (gc - rc)))) # multiple if else for h
    
    h = (h/6.0) % 1.0
    h = np.where(h == 0, 360, h * 360)
    return np.stack([h, s * 100, v * 100], axis=-1)

def process_image_color(image):
    if image is not None:
        height, width, _ = image.shape

        hsv_array = rgb_to_hsv(image) # convert to hsv

        # set bins
        h_ranges = [
            (316, 360),
            (1, 25),
            (26, 40),
            (41, 120),
            (121, 190),
            (191, 270),
            (271, 295),
            (295, 315)
        ]

        s_ranges = [
            (0, 20),
            (21, 70),
            (71, 100)
        ]

        v_ranges = [
            (0, 20),
            (21, 70),
            (71, 100)
        ]

        # initialize a 4x4 grid to divide the images into 16 parts
        subarrays = np.array([hsv_array[i * (height // 4):(i + 1) * (height // 4), j * (width // 4):(j + 1) * (width // 4), :]
                          for i in range(4) for j in range(4)]) 

        # create an array of 16 vectors
        vectors = []
        for subarray in subarrays:
            h_values, s_values, v_values = subarray[:, :, 0].flatten(), subarray[:, :, 1].flatten(), subarray[:, :, 2].flatten()
            
            # each vector has a length of 72 representing the number of possible hsv combinations
            vector = np.zeros(72, dtype=int)

            for h_category, (h_min, h_max) in enumerate(h_ranges):
                h_mask = (h_values >= h_min) & (h_values <= h_max)

                for s_category, (s_min, s_max) in enumerate(s_ranges):
                    s_mask = (s_values >= s_min) & (s_values <= s_max)

                    for v_category, (v_min, v_max) in enumerate(v_ranges):
                        v_mask = (v_values >= v_min) & (v_values <= v_max)

                        combination_mask = h_mask & s_mask & v_mask

                        vector[h_category * 9 + s_category * 3 + v_category] = np.sum(combination_mask)
                        
            vectors.append(vector)
        return np.array(vectors) # return array of 16 vectors
    else:
        print("Failed to load the image.")
        return

# cosine function
def cos(A, B):
    lengthA = 0
    lengthB = 0
    sum = 0
    for i in range(len(A)):
        lengthA += A[i] ** 2
        lengthB += B[i] ** 2
        sum += A[i] * B[i]
    
    lengthA = (lengthA) ** 0.5
    lengthB = (lengthB) ** 0.5
    return (sum / (lengthA * lengthB))

# cosine similarity
def cosine_similarity(A, B):
    avg = 0
    for i in range(len(A)):
        avg += cos(A[i], B[i])
    avg /= len(A)
    return avg

# multithreading
def process_images_color(image_paths):
    images = [cv2.imread(image_path) for image_path in image_paths]
    processed_images = []

    with ThreadPoolExecutor() as executor:
        image_futures = [executor.submit(process_image_color, image) for image in images]

    for future in image_futures:
        processed_images.append(future.result())

    return processed_images

# example main
def main():
    start = time.time()

    uploaded_image = cv2.imread('images/1.jpg')
    image_paths = [f'dataset/{i}.jpg' for i in range(1, 20)]
    processed_upload = process_image_color(uploaded_image)
    images = process_images_color(image_paths)

    for i in range(len(images)):
        print(f"Result of comparing with image {i+1}: {cosine_similarity(images[i], processed_upload)}")
        # print(images[i])

    end = time.time()
    print(f"Runtime: {end - start}")

if __name__ == "__main__":
    main()