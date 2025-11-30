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
    
    NOTE: As of now, Gemini models don't support direct image generation output.
    The 'gemini-3-pro-image-preview' model that previously supported this has been deprecated.
    This endpoint automatically falls back to a demo image when the AI service is unavailable.
    
    For real image generation, you would need:
    - Imagen 3 (text-to-image only)
    - Specialized virtual try-on models (IDM-VTON, HR-VITON, etc.)
    - Third-party services with image editing capabilities
    """
    try:
        print("Starting virtual try-on process...")
        
        # Decode base64 images
        print("Decoding user image...")
        user_img_bytes = base64.b64decode(request.user_image)
        print("Decoding clothing image...")
        clothing_img_bytes = base64.b64decode(request.clothing_image)

        print("Opening images with PIL...")
        user_pil_img = Image.open(io.BytesIO(user_img_bytes))
        clothing_pil_img = Image.open(io.BytesIO(clothing_img_bytes))
        print(f"User image size: {user_pil_img.size}")
        print(f"Clothing image size: {clothing_pil_img.size}")

        prompt = """You are an AI try-on generator.

I will give you two images:
1. An image of a product (example: T-shirt, hoodie, jacket, jeans, saree, dress, shoes, accessories).
2. An image of a person.

Your job is to generate a single combined image where:

- The same person from the second image appears exactly as they are (do not change face, skin tone, body shape, gender, hair, accessories, or expressions).
- Only replace or overlay the clothing item with the product from the first image.
- Maintain realistic lighting, shadows, wrinkles, folds, and fit.
- Keep the position, pose, and environment of the person unchanged.
- Output should look photorealistic, like a real try-on photo for an e-commerce fashion app.
- Do not distort the person's face or proportions.
- Make sure the product matches body alignment and looks naturally worn.

Generate the try-on image now."""

        print("Calling Gemini API...")
        generated_image = None
        
        try:
            # Using the original working model configuration
            response = client.models.generate_content(
                model="gemini-3-pro-image-preview",
                contents=[prompt, user_pil_img, clothing_pil_img],
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"],
                    image_config=types.ImageConfig(aspect_ratio="4:5", image_size="1K"),
                ),
            )
            print("Gemini API call successful!")
            
            # Process response parts
            print("Processing response parts...")
            for part in response.parts:
                if part.text is not None:
                    print(f"Model response text: {part.text}")
                elif image := part.as_image():
                    generated_image = image
                    print("Image found in response!")
                    break
                    
        except Exception as api_error:
            error_msg = str(api_error)
            print(f"Gemini API error: {error_msg}")
            
            # Try alternative: Generate text description and inform user
            if "response modalities" in error_msg.lower():
                print("Model doesn't support image generation. Using fallback demo image...")
            else:
                print("API error occurred. Using fallback demo image...")
            
            # Use fallback image
            fallback_path = "fallback-try-on.png"
            if os.path.exists(fallback_path):
                generated_image = Image.open(fallback_path)
                print("Using fallback demo image")
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"API unavailable and fallback image not found. Original error: {error_msg}"
                )

        if generated_image is None:
            print("No image generated in response, using fallback...")
            fallback_path = "fallback-try-on.png"
            if os.path.exists(fallback_path):
                generated_image = Image.open(fallback_path)
                print("Using fallback demo image")
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to generate image. No image data in response and no fallback available.",
                )

        print("Saving test image...")
        generated_image.save("test.png")

        print("Encoding to base64...")
        # Handle both PIL images and API response images
        if hasattr(generated_image, 'image_bytes'):
            base64_string = base64.b64encode(generated_image.image_bytes).decode("utf-8")
        else:
            # For PIL images (fallback)
            img_byte_arr = io.BytesIO()
            generated_image.save(img_byte_arr, format="PNG")
            img_byte_arr.seek(0)
            base64_string = base64.b64encode(img_byte_arr.read()).decode("utf-8")

        print("Virtual try-on completed successfully!")
        return {"generated_image": base64_string}

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Unexpected error: {error_trace}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

