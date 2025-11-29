# Virtual Try-On with Gemini

This FastAPI application provides a virtual try-on service using Google's Gemini Pro Vision model. You can upload an image of a person and an image of a clothing item, and the service will return an image of the person wearing the clothing.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Install dependencies:**

    This project uses [Poetry](https://python-poetry.org/) for dependency management.

    ```bash
    poetry install
    ```

3.  **Set up your environment variables:**

    Create a `.env` file in the root of the project and add your Google API key:

    ```
    GOOGLE_API_KEY="your_google_api_key"
    ```

    You can get your API key from [Google AI Studio](https://aistudio.google.com/).

## Running the Application

1.  **Activate the virtual environment:**

    ```bash
    poetry shell
    ```

2.  **Start the FastAPI server:**
    ```bash
    uvicorn main:app --reload
    ```

The application will be running at `http://127.0.0.1:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

You can use this interface to upload your images and test the virtual try-on functionality.

## How it works

The application uses the `gemini-pro-vision` model to generate the try-on image. It sends both the user's image and the clothing image to the model with a prompt asking it to create a realistic image of the person wearing the clothing item. The generated image is then sent back as the response.
