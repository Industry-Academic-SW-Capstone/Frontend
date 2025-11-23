from PIL import Image
import os

def generate_icons():
    source_path = "public/new_logo.png"
    
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        return

    try:
        img = Image.open(source_path)
        
        # Define sizes and filenames
        icons = [
            (192, "public/icon-192.png"),
            (512, "public/icon-512.png"),
            (180, "public/apple-touch-icon.png"),
            (48, "public/favicon.png"),
        ]

        for size, filename in icons:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(filename)
            print(f"Generated {filename} ({size}x{size})")

        # Generate favicon.ico specifically
        img.resize((48, 48), Image.Resampling.LANCZOS).save("public/favicon.ico")
        print("Generated public/favicon.ico (48x48)")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_icons()
