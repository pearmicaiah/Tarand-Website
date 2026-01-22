
from colorthief import ColorThief
import sys

try:
    color_thief = ColorThief('e:/Desktop/Tarand Website/logo.png')
    # get the dominant color
    dominant_color = color_thief.get_color(quality=1)
    # get palette
    palette = color_thief.get_palette(color_count=3)
    
    print(f"Dominant: {dominant_color}")
    print(f"Palette: {palette}")
except Exception as e:
    print(f"Error: {e}")
