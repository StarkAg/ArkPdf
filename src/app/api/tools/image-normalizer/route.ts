import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max processing time

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const width = formData.get("width")?.toString() || "1200";
    const height = formData.get("height")?.toString() || "1200";

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF file." },
        { status: 400 }
      );
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), "temp");
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, ignore
    }

    // Save uploaded file to temp directory
    const timestamp = Date.now();
    const inputPath = join(tempDir, `input_${timestamp}.pdf`);
    const outputPath = join(tempDir, `output_${timestamp}.pdf`);
    const pythonScriptPath = join(process.cwd(), "scripts", "normalize_images.py");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(inputPath, buffer);

    // Execute Python script
    try {
      const command = `python3 "${pythonScriptPath}" "${inputPath}" "${outputPath}" ${width} ${height}`;
      await execAsync(command, { timeout: 55000 }); // 55 second timeout
    } catch (error: any) {
      // Clean up input file
      try {
        await unlink(inputPath);
      } catch {}

      return NextResponse.json(
        {
          error: `Processing failed: ${error.message || "Unknown error"}`,
        },
        { status: 500 }
      );
    }

    // Read the processed PDF
    const processedPdf = await readFile(outputPath);

    // Clean up temp files
    try {
      await unlink(inputPath);
      await unlink(outputPath);
    } catch (err) {
      // Ignore cleanup errors
    }

    // Return the processed PDF
    return new NextResponse(processedPdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", "_normalized.pdf")}"`,
      },
    });
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred while processing the PDF.",
      },
      { status: 500 }
    );
  }
}

