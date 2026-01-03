#!/usr/bin/env python3
"""
ArkPDF Image Size Normalizer
Normalizes all embedded images in a PDF to a consistent canvas size.
Each image gets its own page, all images are stretched to match visual size.
"""

import sys
import fitz  # PyMuPDF
from PIL import Image
import io

def normalize_pdf_images(input_path: str, output_path: str, target_width: int, target_height: int):
    """
    Process a PDF file and normalize all embedded images.
    Each image gets its own page, all images are stretched to the same visual size.
    
    Args:
        input_path: Path to input PDF file
        output_path: Path to output PDF file
        target_width: Target width in pixels (internal image size)
        target_height: Target height in pixels (internal image size)
    """
    try:
        # Open the PDF
        doc = fitz.open(input_path)
        
        # Create a new PDF for output
        new_doc = fitz.open()
        
        # Define a consistent page size for ALL pages (in points, 72 DPI)
        # This ensures all images appear the same size visually
        standard_page_width = 600  # 600 points = ~8.33 inches
        standard_page_height = 600  # 600 points = ~8.33 inches
        
        # Convert to pixels (72 DPI: 1 point = 1 pixel)
        standard_page_width_px = int(standard_page_width)
        standard_page_height_px = int(standard_page_height)
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Get all images on the page
            image_list = page.get_images(full=True)
            
            # Process each unique image xref
            processed_xrefs = set()
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                
                # Skip if we've already processed this xref
                if xref in processed_xrefs:
                    continue
                
                processed_xrefs.add(xref)
                
                try:
                    # Extract image data
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Open image with PIL
                    pil_image = Image.open(io.BytesIO(image_bytes))
                    
                    # Convert to RGB if necessary
                    if pil_image.mode in ("RGBA", "LA", "P"):
                        rgb_image = Image.new("RGB", pil_image.size, (255, 255, 255))
                        if pil_image.mode == "P":
                            pil_image = pil_image.convert("RGBA")
                        mask = pil_image.split()[-1] if pil_image.mode in ("RGBA", "LA") else None
                        rgb_image.paste(pil_image, mask=mask)
                        pil_image = rgb_image
                    elif pil_image.mode != "RGB":
                        pil_image = pil_image.convert("RGB")
                    
                    # Get all occurrences of this image on the page
                    image_rects = page.get_image_rects(xref)
                    
                    # Create a page for each occurrence (1 image per page)
                    for rect in image_rects:
                        # Create a new page with STANDARD size (all pages same size)
                        new_page = new_doc.new_page(width=standard_page_width, height=standard_page_height)
                        
                        # Make image fill the ENTIRE page (no padding, no margins)
                        # Use the full standard page dimensions
                        full_page_rect = fitz.Rect(0, 0, standard_page_width, standard_page_height)
                        
                        # STRETCH image to fill entire standard page (no aspect ratio preservation)
                        # All images will be stretched to the same size
                        page_fill_image = pil_image.resize((standard_page_width_px, standard_page_height_px), Image.Resampling.LANCZOS)
                        
                        # Convert to JPEG bytes
                        page_img_buffer = io.BytesIO()
                        page_fill_image.save(page_img_buffer, format="JPEG", quality=95, optimize=True)
                        page_img_bytes = page_img_buffer.getvalue()
                        
                        # Insert image to fill entire page with no padding
                        new_page.insert_image(
                            full_page_rect,
                            stream=page_img_bytes,
                            width=standard_page_width_px,
                            height=standard_page_height_px
                        )
                    
                except Exception as img_error:
                    print(f"Warning: Failed to process image {xref} on page {page_num}: {img_error}", file=sys.stderr)
                    import traceback
                    traceback.print_exc()
                    continue
        
        # Get page count before closing
        page_count = len(new_doc)
        
        # Save the new PDF
        new_doc.save(output_path, garbage=4, deflate=True, incremental=False)
        new_doc.close()
        doc.close()
        
        print(f"Successfully normalized images in PDF: {output_path}", file=sys.stderr)
        print(f"Created {page_count} pages (1 image per page)", file=sys.stderr)
        print(f"All pages are {standard_page_width}x{standard_page_height} points (same size)", file=sys.stderr)
        print(f"All images fill entire page (stretched to {standard_page_width}x{standard_page_height}, no padding, no aspect ratio)", file=sys.stderr)
        
    except Exception as e:
        print(f"Error processing PDF: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
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
