import base64
import sys

def decode_base64_to_image(input_file_path, output_image_path):
    """
    Reads a base64 encoded string from a file, decodes it,
    and saves it as an image file.

    Args:
        input_file_path (str): The path to the file containing the base64 string.
        output_image_path (str): The path to save the output image file.
    """
    try:
        # Read the base64 string from the input file
        with open(input_file_path, 'r') as f:
            base64_string = f.read()

        # Decode the base64 string
        image_data = base64.b64decode(base64_string)

        # Write the decoded data to the output image file
        with open(output_image_path, 'wb') as image_file:
            image_file.write(image_data)

        print(f"Image successfully saved to '{output_image_path}'")

    except FileNotFoundError:
        print(f"Error: The file '{input_file_path}' was not found.")
    except base64.binascii.Error as e:
        print(f"Error decoding base64 string: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python decode_image.py <path_to_input_file.txt> <path_to_output_image.png>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    decode_base64_to_image(input_file, output_file)
