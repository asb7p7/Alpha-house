import os
import io
import base64
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai
from google.genai import types
from PIL import Image
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI app
app = FastAPI(title="Virtual Try-On API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the client
try:
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    raise RuntimeError(
        "GOOGLE_API_KEY not found in .env file. Please create a .env file and add your API key."
    )


class ImageTryOnRequest(BaseModel):
    user_image: str
    clothing_image: str


@app.post("/try-on/")
async def virtual_try_on(request: ImageTryOnRequest) -> dict:
    """
    Receives a user's image and a clothing item image as base64 encoded strings,
    and returns a virtual try-on image with the clothing item overlayed on the user.
    """
    try:
        user_img_bytes = base64.b64decode(request.user_image)
        clothing_img_bytes = base64.b64decode(request.clothing_image)

        user_pil_img = Image.open(io.BytesIO(user_img_bytes))
        clothing_pil_img = Image.open(io.BytesIO(clothing_img_bytes))

        prompt = """
**“You are an AI try-on generator.



I will give you two images:

An image of a product (example: T-shirt, hoodie, jacket, jeans, saree, dress, shoes, accessories).

An image of a person.

Your job is to generate a single combined image where:



The same person from the second image appears exactly as they are (do not change face, skin tone, body shape, gender, hair, accessories, or expressions).

Only replace or overlay the clothing item with the product from the first image.

Maintain realistic lighting, shadows, wrinkles, folds, and fit.

Keep the position, pose, and environment of the person unchanged.

Output should look photorealistic, like a real try-on photo for an e-commerce fashion app.

Do not distort the person's face or proportions.

Make sure the product matches body alignment and looks naturally worn.”**
"""

        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[prompt, user_pil_img, clothing_pil_img],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="4:5", image_size="1K"),
            ),
        )

        generated_image = None
        for part in response.parts:
            if part.text is not None:
                print(f"Model response text: {part.text}")
            elif image := part.as_image():
                generated_image = image
                break

        if generated_image is None:
            # Fallback or error if no image is generated
            error_detail = "Failed to generate image. No image data in response."
            raise HTTPException(
                status_code=500,
                detail=error_detail,
            )

        generated_image.save("test.png")

        base64_string = base64.b64encode(
            generated_image.image_bytes
        ).decode("utf-8")

        # Save image to a byte stream
        # img_byte_arr = io.BytesIO()
        # generated_image.save(img_byte_arr, format="PNG")
        # img_byte_arr.seek(0)

        return {"generated_image": base64_string}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

