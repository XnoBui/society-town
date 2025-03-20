from fastapi import FastAPI, HTTPException, WebSocket, Request
from fastapi.responses import Response, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw
import io
import os
import json
from typing import Optional, Dict
from base64 import b64encode

# Create FastAPI app
app = FastAPI(
    title="AI Twin - 3D Interactive Reveal",
    description="Generate and reveal your unique AI Twin through an interactive 3D experience",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Store active WebSocket connections
active_connections: Dict[int, WebSocket] = {}

# ASCII art for different character types
CHARACTER_ICONS = {
    "Humanoid": """
   ░░█░░
  ░░███░
  ▓█████
 ▓███████
░████◆███░
 ▓███████
  ▓█████
   ▓███
    ▓█
""",
    "Cybernetic": """
   ░░░░░
 ▓█▒▒▒▒▒█▓
█▒░░░◆░░░▒█
█▒█████▒░▒█
█◆█▒▒▒█◆░█
█▒█████▒░▒█
█▒░░░◆░░░▒█
 ▓█▒▒▒▒▒█▓
   ░░░░░
""",
    "Draconic": """
   ▓░░
  ▓██░░
 ▓████▒░
▓██████▒░
███◆███▒░░
▓██████▒░
 ▓████▒░
  ▓██░░
   ▓░░
""",
    "Celestial": """
   ░◆◆◆░
  ◆░░░░░◆
 ◆░▒▒▒▒░░◆
◆░▒█████▒░◆
◆░████◆██░◆
◆░▒█████▒░◆
 ◆░▒▒▒▒░░◆
  ◆░░░░░◆
   ░◆◆◆░
""",
    "TechFrame": """
█████████████████
█░░░░░░░░░░░░░░█
█░▓▓▓▓▓▓▓▓▓▓▓░█
█░▓         ▓░█
█░▓  ◆◆◆◆◆  ▓░█
█░▓ ◆░░░░░◆ ▓░█
█░▓ ◆░███░◆ ▓░█
█░▓ ◆░░░░░◆ ▓░█
█░▓  ◆◆◆◆◆  ▓░█
█░▓         ▓░█
█░▓▓▓▓▓▓▓▓▓▓▓░█
█░░░░░░░░░░░░░░█
█▒▒▒▒TYPE▒▒▒▒▒█
█░░░░░░░░░░░░░░█
█████████████████
"""
}

# Color mappings for different ASCII characters
COLOR_MAP = {
    "█": (180, 180, 185),    # Primary color - metallic gray
    "▓": (120, 120, 125),    # Secondary color - darker gray
    "▒": (200, 200, 205),    # Highlights - light metallic
    "░": (100, 100, 105),    # Background - dark gray
    "◆": (0, 255, 220, 180), # Glowing elements - cyan with transparency
    " ": (0, 0, 0, 0)        # Transparent
}

def create_pixel_art(ascii_art: str, scale: int = 4) -> Image.Image:
    """Convert ASCII art to a PIL Image with actual pixels."""
    try:
        # Split the ASCII art into lines and get dimensions
        lines = ascii_art.strip().split("\n")
        width = max(len(line) for line in lines)
        height = len(lines)
        
        # Create a new image with transparency
        img = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw each character as a scaled pixel
        for y, line in enumerate(lines):
            for x, char in enumerate(line):
                if char in COLOR_MAP:
                    color = COLOR_MAP[char]
                    rect = [
                        x * scale,
                        y * scale,
                        (x + 1) * scale,
                        (y + 1) * scale
                    ]
                    draw.rectangle(rect, fill=color)
        
        return img
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating pixel art: {str(e)}"
        )

def image_to_base64(img: Image.Image) -> str:
    """Convert PIL Image to base64 string."""
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return b64encode(buffer.getvalue()).decode()

@app.get("/")
async def read_root():
    """Serve the main HTML page."""
    try:
        with open("static/index.html", "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="HTML file not found")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Twin Generator",
        "version": "1.0.0"
    }

@app.get("/api/character-types")
async def get_character_types():
    """Get available character types and their probabilities."""
    return CHARACTER_ICONS

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections for live updates."""
    await websocket.accept()
    connection_id = id(websocket)
    active_connections[connection_id] = websocket
    
    try:
        while True:
            data = await websocket.receive_json()
            
            # Process the received data
            character_type = data.get('type')
            gene_stars = data.get('stars', 3)
            
            if character_type in CHARACTER_ICONS:
                # Calculate probability based on character type and gene stars
                base_probability = CHARACTER_ICONS[character_type]
                star_multiplier = gene_stars * 0.2  # 20% increase per star
                final_probability = min(base_probability * (1 + star_multiplier), 100)
                
                # Send response
                await websocket.send_json({
                    'status': 'success',
                    'type': character_type,
                    'probability': final_probability,
                    'description': CHARACTER_ICONS[character_type]
                })
            else:
                await websocket.send_json({
                    'status': 'error',
                    'message': f'Invalid character type: {character_type}'
                })
                
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        del active_connections[connection_id]
        await websocket.close()

@app.get("/api/generate-twin")
async def generate_twin(character_type: str, gene_stars: int = 3):
    """Generate an AI Twin based on character type and gene stars."""
    if character_type not in CHARACTER_ICONS:
        raise HTTPException(status_code=400, detail="Invalid character type")
    
    if not 1 <= gene_stars <= 5:
        raise HTTPException(status_code=400, detail="Gene stars must be between 1 and 5")
    
    try:
        # Calculate probability
        base_probability = CHARACTER_ICONS[character_type]
        star_multiplier = gene_stars * 0.2
        final_probability = min(base_probability * (1 + star_multiplier), 100)
        
        return {
            'status': 'success',
            'type': character_type,
            'probability': final_probability,
            'description': CHARACTER_ICONS[character_type],
            'gene_stars': gene_stars
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating AI Twin: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting AI Twin Generator server...")
    print("Available at: http://localhost:8081")
    print("API documentation: http://localhost:8081/docs")
    uvicorn.run(app, host="127.0.0.1", port=8081) 