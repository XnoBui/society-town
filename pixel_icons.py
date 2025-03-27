"""
Pixel art icons for different character types and UI elements.
Each icon is represented as ASCII art that can be converted to actual pixel art.
Using multiple characters to represent different colors:
█ - Primary color
▓ - Secondary color/shading
▒ - Highlights/details
░ - Background details
◆ - Glowing elements
"""

TECH_FRAME = """
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

HUMANOID_SWORD = """
   ░░█░░
  ░░███░
  ▓█████
 ▓███████
░████◆███░
 ▓███████
  ▓█████
   ▓███
    ▓█
"""

CYBERNETIC_GEAR = """
   ░░░░░
 ▓█▒▒▒▒▒█▓
█▒░░░◆░░░▒█
█▒█████▒░▒█
█◆█▒▒▒█◆░█
█▒█████▒░▒█
█▒░░░◆░░░▒█
 ▓█▒▒▒▒▒█▓
   ░░░░░
"""

DRACONIC_WING = """
   ▓░░
  ▓██░░
 ▓████▒░
▓██████▒░
███◆███▒░░
▓██████▒░
 ▓████▒░
  ▓██░░
   ▓░░
"""

CELESTIAL_HALO = """
   ░◆◆◆░
  ◆░░░░░◆
 ◆░▒▒▒▒░░◆
◆░▒█████▒░◆
◆░████◆██░◆
◆░▒█████▒░◆
 ◆░▒▒▒▒░░◆
  ◆░░░░░◆
   ░◆◆◆░
"""

# Dictionary mapping character types to their icons
CHARACTER_ICONS = {
    "Humanoid": HUMANOID_SWORD,
    "Cybernetic": CYBERNETIC_GEAR,
    "Draconic": DRACONIC_WING,
    "Celestial": CELESTIAL_HALO,
    "TechFrame": TECH_FRAME
}

def get_character_icon(character_type: str) -> str:
    """
    Get the pixel art icon for a given character type.
    
    Args:
        character_type (str): The type of character or UI element
        
    Returns:
        str: The ASCII art representation of the character's icon
    """
    return CHARACTER_ICONS.get(character_type, "") 