import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir, access } from "fs/promises";
import { existsSync } from "fs";
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

    // Use /tmp for serverless environments (Vercel, AWS Lambda, etc.)
    // Fallback to process.cwd()/temp for local development
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    let tempDir = isServerless ? "/tmp" : join(process.cwd(), "temp");
    
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (err: any) {
      // If directory creation fails and we're not in serverless, try /tmp as fallback
      if (!isServerless && err.code !== "EEXIST") {
        tempDir = "/tmp";
        try {
          await mkdir(tempDir, { recursive: true });
        } catch (fallbackErr) {
          return NextResponse.json(
            { error: "Failed to create temporary directory" },
            { status: 500 }
          );
        }
      } else if (isServerless && err.code !== "EEXIST") {
        return NextResponse.json(
          { error: "Failed to access temporary directory in serverless environment" },
          { status: 500 }
        );
      }
    }

    // Save uploaded file to temp directory
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const inputPath = join(tempDir, `input_${timestamp}_${randomId}.pdf`);
    const outputPath = join(tempDir, `output_${timestamp}_${randomId}.pdf`);
    
    // Python script path - in serverless, scripts need to be in the deployment
    const pythonScriptPath = isServerless 
      ? join(process.cwd(), "scripts", "normalize_images.py")
      : join(process.cwd(), "scripts", "normalize_images.py");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write input file
    try {
      await writeFile(inputPath, buffer);
    } catch (writeErr: any) {
      return NextResponse.json(
        { 
          error: `Failed to write temporary file: ${writeErr.message}. Temp directory: ${tempDir}` 
        },
        { status: 500 }
      );
    }

    // Execute Python script - use venv Python if available, otherwise system python3
    const venvPython = join(process.cwd(), "venv", "bin", "python3");
    const pythonCmd = existsSync(venvPython) ? venvPython : "python3";
    
    try {
      const command = `"${pythonCmd}" "${pythonScriptPath}" "${inputPath}" "${outputPath}" ${width} ${height}`;
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 55000, // 55 second timeout
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      
      // Log any stderr output for debugging
      if (stderr && !stderr.includes("Successfully")) {
        console.warn("Python script stderr:", stderr);
      }
    } catch (error: any) {
      // Clean up input file
      try {
        await unlink(inputPath);
      } catch {}
      
      // Clean up output file if it exists but is incomplete
      try {
        await unlink(outputPath);
      } catch {}

      const errorMessage = error.stderr 
        ? `Python script error: ${error.stderr.split('\n').slice(-3).join(' ')}`
        : error.message || "Unknown error";
      
      console.error("Python script execution failed:", errorMessage);
      
      return NextResponse.json(
        {
          error: `Processing failed: ${errorMessage}`,
        },
        { status: 500 }
      );
    }
    
    // Check if output file exists
    try {
      await readFile(outputPath);
    } catch (err) {
      // Clean up input file
      try {
        await unlink(inputPath);
      } catch {}
      
      return NextResponse.json(
        {
          error: "Processing completed but output file was not created. Please check server logs.",
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

