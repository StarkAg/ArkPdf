# ArkPDF – Powered Document Transformation

ArkPDF is a multi-tool PDF platform built with Next.js 14 (App Router) for intelligent document transformation. The platform provides modular tools that can be composed into custom document processing pipelines.

## Features

### ✅ Image Size Normalizer (Core Feature)
- Upload PDF files and normalize all embedded images to a consistent canvas size
- Preserve aspect ratios while padding with white backgrounds
- Configurable target dimensions (default: 1200 × 1200px)
- High-quality LANCZOS resampling for optimal image quality

### 🚧 Coming Soon
- **PDF Compressor**: Smart compression profiles for print, web, and archival workflows
- **PDF Merger**: Deterministic merging with page range selection
- **OCR Extractor**: Extract structured text from scanned documents

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Route Handlers)
- **Python Processing**: PyMuPDF (fitz), Pillow (PIL)
- **TypeScript**: Full type safety throughout

## Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.8+ with pip
- **Python Dependencies**: PyMuPDF and Pillow

## Setup Instructions

### 1. Install Node.js Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:

```bash
pip install PyMuPDF>=1.23.0 Pillow>=10.0.0
```

### 3. Make Python Script Executable (Optional)

```bash
chmod +x scripts/normalize_images.py
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ArkPdf/
├── src/
│   └── app/
│       ├── page.tsx                    # Homepage with tools dashboard
│       ├── layout.tsx                  # Root layout
│       ├── tools/
│       │   ├── layout.tsx              # Tools navigation sidebar
│       │   ├── image-size-normalizer/
│       │   │   └── page.tsx            # Image Size Normalizer UI
│       │   ├── pdf-compressor/
│       │   │   └── page.tsx            # PDF Compressor placeholder
│       │   ├── pdf-merger/
│       │   │   └── page.tsx            # PDF Merger placeholder
│       │   └── ocr-extractor/
│       │       └── page.tsx            # OCR Extractor placeholder
│       └── api/
│           └── tools/
│               └── image-normalizer/
│                   └── route.ts       # API endpoint for image normalization
├── scripts/
│   └── normalize_images.py            # Python script for PDF image processing
├── requirements.txt                    # Python dependencies
└── package.json                        # Node.js dependencies
```

## Usage

### Image Size Normalizer

1. Navigate to `/tools/image-size-normalizer` or click the tool from the homepage
2. Upload a PDF file using the file input
3. Set target width and height (default: 1200 × 1200px)
4. Click "Process PDF" to start normalization
5. Download the processed PDF once complete

The tool will:
- Extract all embedded images from the PDF
- Resize each image to fit within target dimensions (preserving aspect ratio)
- Pad images with white backgrounds to match exact target size
- Rebuild the PDF with normalized images

## API Endpoint

### POST `/api/tools/image-normalizer`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `pdf`: PDF file (File)
  - `width`: Target width in pixels (number, default: 1200)
  - `height`: Target height in pixels (number, default: 1200)

**Response:**
- Success (200): Processed PDF file (application/pdf)
- Error (400/500): JSON error message

## Python Script

The `scripts/normalize_images.py` script can also be run standalone:

```bash
python3 scripts/normalize_images.py <input_pdf> <output_pdf> <target_width> <target_height>
```

Example:
```bash
python3 scripts/normalize_images.py input.pdf output.pdf 1200 1200
```

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Architecture Notes

- **Modular Design**: Each tool is self-contained in its own route, making it easy to add new tools without refactoring
- **Separation of Concerns**: Frontend UI, API routes, and Python processing are cleanly separated
- **Error Handling**: Comprehensive error handling at all layers with user-friendly messages
- **Progress Tracking**: Real-time upload and processing progress feedback
- **Type Safety**: Full TypeScript coverage for maintainability

## Adding New Tools

To add a new tool:

1. Create a new route: `src/app/tools/your-tool-name/page.tsx`
2. Add navigation link in `src/app/tools/layout.tsx`
3. Add tool card to `src/app/page.tsx` tools array
4. Create API route if needed: `src/app/api/tools/your-tool-name/route.ts`
5. Add any Python scripts to `scripts/` directory

## Troubleshooting

### Python Script Not Found
- Ensure `scripts/normalize_images.py` exists and is executable
- Check that Python 3 is available: `python3 --version`

### Import Errors (PyMuPDF/Pillow)
- Verify Python dependencies: `pip list | grep -E "(PyMuPDF|Pillow)"`
- Reinstall if needed: `pip install -r requirements.txt`

### File Upload Issues
- Check file size limits (default Next.js limit applies)
- Ensure PDF files are valid and not corrupted

### Processing Timeouts
- Large PDFs with many images may take longer
- API route has a 60-second timeout (configurable in `route.ts`)

## License

Private project - All rights reserved.

## Contributing

This is a private project. For questions or issues, please contact the development team.
