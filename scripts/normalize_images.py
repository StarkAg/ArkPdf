#!/usr/bin/env python3
"""
ArkPDF Image Size Normalizer
Normalizes all embedded images in a PDF to a consistent canvas size
while preserving aspect ratios. Images are padded with white backgrounds.
"""

import sys
import fitz  # PyMuPDF
from PIL import Image
import io

def normalize_pdf_images(input_path: str, output_path: str, target_width: int, target_height: int):
    """
    Process a PDF file and normalize all embedded images to target dimensions.
    
    Args:
        input_path: Path to input PDF file
        output_path: Path to output PDF file
        target_width: Target width in pixels
        target_height: Target height in pixels
    """
    try:
        # Open the PDF
        doc = fitz.open(input_path)
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Get all images on the page
            image_list = page.get_images(full=True)
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                
                # Extract image data
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Open image with PIL
                pil_image = Image.open(io.BytesIO(image_bytes))
                
                # Convert to RGB if necessary (for PNG with transparency, etc.)
                if pil_image.mode in ("RGBA", "LA", "P"):
                    # Create white background
                    rgb_image = Image.new("RGB", pil_image.size, (255, 255, 255))
                    if pil_image.mode == "P":
                        pil_image = pil_image.convert("RGBA")
                    rgb_image.paste(pil_image, mask=pil_image.split()[-1] if pil_image.mode in ("RGBA", "LA") else None)
                    pil_image = rgb_image
                elif pil_image.mode != "RGB":
                    pil_image = pil_image.convert("RGB")
                
                # Calculate scaling to fit within target dimensions while preserving aspect ratio
                img_width, img_height = pil_image.size
                scale_w = target_width / img_width
                scale_h = target_height / img_height
                scale = min(scale_w, scale_h)  # Use smaller scale to fit within bounds
                
                new_width = int(img_width * scale)
                new_height = int(img_height * scale)
                
                # Resize image with high-quality LANCZOS resampling
                resized_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Create new image with target dimensions and white background
                normalized_image = Image.new("RGB", (target_width, target_height), (255, 255, 255))
                
                # Calculate position to center the image
                x_offset = (target_width - new_width) // 2
                y_offset = (target_height - new_height) // 2
                
                # Paste resized image onto white background
                normalized_image.paste(resized_image, (x_offset, y_offset))
                
                # Convert back to bytes
                img_buffer = io.BytesIO()
                normalized_image.save(img_buffer, format="JPEG", quality=95)
                img_bytes = img_buffer.getvalue()
                
                # Replace the image in the PDF
                doc.update_stream(xref, img_bytes)
        
        # Save the modified PDF
        doc.save(output_path, garbage=4, deflate=True)
        doc.close()
        
        print(f"Successfully normalized images in PDF: {output_path}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error processing PDF: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python3 normalize_images.py <input_pdf> <output_pdf> <target_width> <target_height>", file=sys.stderr)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    target_width = int(sys.argv[3])
    target_height = int(sys.argv[4])
    
    normalize_pdf_images(input_path, output_path, target_width, target_height)

