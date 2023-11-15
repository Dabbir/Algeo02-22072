import cv2
import numpy as np
import math
import time
from concurrent.futures import ThreadPoolExecutor

# process image by texture
def process_image_texture(image):
    if image is not None:
        
        # extract rgb and convert to grayscale
        b, g, r = image[:, :, 0], image[:, :, 1], image[:, :, 2]
        gs = r * 0.299 + g * 0.587 + b * 0.114
        grayscale_array = gs.astype(np.uint8)

        # make a cooccurrence matrix
        cooccurrence = np.histogram2d(grayscale_array[:, :-1].ravel(), grayscale_array[:, 1:].ravel(), bins=256, range=[[0, 255], [0, 255]])[0]

        # tranpose and add with original coccurrence to get symmetric matrix
        transpose_cooccurrence = cooccurrence.T
        sym_matrix = cooccurrence + transpose_cooccurrence

        # get matrix normalization
        matrix_norm = sym_matrix / np.sum(sym_matrix)

        # get i an j
        i, j = np.indices(matrix_norm.shape)
        diff = i - j

        # create a mask to only process nonzero elements
        non_zero_indices = matrix_norm != 0

        che = np.zeros(6, dtype='float64') # create vector for parameters 
        che[0] = np.sum(matrix_norm[non_zero_indices] * diff[non_zero_indices] ** 2) # contrast
        che[1] = np.sum(matrix_norm[non_zero_indices] / (1 + diff[non_zero_indices] ** 2)) # homogeneity
        che[2] = -np.sum(matrix_norm[non_zero_indices] * np.log10(matrix_norm[non_zero_indices])) # entropy
        che[3] = np.sum(matrix_norm[non_zero_indices] * np.abs(diff[non_zero_indices])) # dissimilarity
        che[4] = np.sum(matrix_norm[non_zero_indices] ** 2) # ASM
        che[5] = np.sqrt(che[4]) # energy
        return che
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
    
    lengthA = lengthA ** 0.5
    lengthB = lengthB ** 0.5

    return (sum / (lengthA * lengthB))

# multithreading processing
def process_images_texture(image_paths):
    images = [cv2.imread(image_path) for image_path in image_paths]
    processed_images = []

    with ThreadPoolExecutor() as executor:
        image_futures = [executor.submit(process_image_texture, image) for image in images]

    for future in image_futures:
        processed_images.append(future.result())

    return processed_images

# main example
def main():
    start = time.time()

    uploaded_image = cv2.imread('dataset/9.jpg')
    image_paths = [f'dataset/{i}.jpg' for i in range(1, 10)]
    processed_upload = process_image_texture(uploaded_image)
    images = process_images_texture(image_paths)

    for i in range(len(images)):
        print(f"Result of comparing with image {i+1}: {cos(images[i], processed_upload)}")

    end = time.time()
    print(f"Runtime: {end - start}")

if __name__ == "__main__":
    main()