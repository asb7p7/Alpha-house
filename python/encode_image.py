import base64
import sys


def encode_image_to_base64(image_path):
    """
    Encodes an image file to a base64 string.

    Args:
        image_path (str): The path to the image file.

    Returns:
        str: The base64 encoded string of the image.
    """
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        return encoded_string
    except FileNotFoundError:
        return f"Error: The file '{image_path}' was not found."
    except Exception as e:
        return f"An error occurred: {e}"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python encode_image.py <path_to_image>")
        sys.exit(1)

    image_path = sys.argv[1]
    base64_string = encode_image_to_base64(image_path)

    if "Error" in base64_string or "An error occurred" in base64_string:
        print(base64_string)
    else:
        print(base64_string)
