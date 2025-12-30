"use client";

import { useState, useRef } from "react";

type ProcessingState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageSizeNormalizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(1200);
  const [height, setHeight] = useState<number>(1200);
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      setState("idle");
      setDownloadUrl(null);
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setState("uploading");
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("width", width.toString());
    formData.append("height", height.toString());

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const uploadPercent = (e.loaded / e.total) * 40; // Upload is 40% of total
          setProgress(uploadPercent);
        }
      });

      // Handle response
      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          setProgress(50);
          setState("processing");
          
          // Check if response is actually a PDF
          const blob = xhr.response;
          const contentType = xhr.getResponseHeader("content-type");
          
          if (contentType && contentType.includes("application/pdf")) {
            // Simulate processing steps
            setTimeout(() => setProgress(70), 300);
            setTimeout(() => setProgress(85), 600);
            setTimeout(() => {
              const url = URL.createObjectURL(blob);
              setDownloadUrl(url);
              setProgress(100);
              setState("success");
            }, 900);
          } else {
            // Response might be an error JSON, try to read it
            try {
              const text = await blob.text();
              const errorData = JSON.parse(text);
              setError(errorData.error || "Processing failed");
            } catch {
              setError("Received invalid response from server");
            }
            setState("error");
            setProgress(0);
          }
        } else {
          // Handle error response
          setProgress(0);
          setState("error");
          
          try {
            const blob = xhr.response;
            const text = await blob.text();
            try {
              const errorData = JSON.parse(text);
              setError(errorData.error || `Server error: ${xhr.status}`);
            } catch {
              setError(text || `Server error: ${xhr.status}`);
            }
          } catch {
            setError(`Processing failed with status ${xhr.status}`);
          }
        }
      });

      xhr.addEventListener("error", () => {
        setProgress(0);
        setError("Network error. Please check your connection and try again.");
        setState("error");
      });

      xhr.addEventListener("timeout", () => {
        setProgress(0);
        setError("Request timed out. The file might be too large or the server is busy.");
        setState("error");
      });

      xhr.open("POST", "/api/tools/image-normalizer");
      xhr.responseType = "blob";
      xhr.timeout = 60000; // 60 second timeout
      xhr.send(formData);
    } catch (err) {
      setProgress(0);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setState("error");
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file?.name.replace(".pdf", "_normalized.pdf") || "normalized.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Image Size Normalizer
          </h1>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
            Core
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Normalize all embedded images in your PDF to a consistent canvas size
          while preserving aspect ratios. Images are padded with white backgrounds
          to match the target dimensions.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-zinc-800 bg-black/70 p-5 shadow-inner shadow-black/70 sm:p-6">
        {/* File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-200">
            PDF File
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black file:hover:bg-zinc-200 file:cursor-pointer file:transition-colors"
              disabled={state === "uploading" || state === "processing"}
            />
            {file && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-black">
                  ✓
                </span>
                <span className="font-mono">{file.name}</span>
                <span className="text-zinc-600">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Size Configuration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-200">
              Target Width (px)
            </label>
            <input
              type="number"
              min="100"
              max="5000"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 1200)}
              className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/40"
              disabled={state === "uploading" || state === "processing"}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-200">
              Target Height (px)
            </label>
            <input
              type="number"
              min="100"
              max="5000"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 1200)}
              className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/40"
              disabled={state === "uploading" || state === "processing"}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {(state === "uploading" || state === "processing") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                {state === "uploading" ? "Uploading..." : "Processing images..."}
              </span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900/80">
              <div
                className="h-full bg-gradient-to-r from-zinc-50 to-zinc-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {state === "success" && downloadUrl && (
          <div className="rounded-lg border border-zinc-300 bg-zinc-100/10 p-3 text-sm text-zinc-100">
            <div className="flex items-center gap-2">
              <span className="text-zinc-50">✓</span>
              <span>PDF processed successfully! Ready for download.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleProcess}
            disabled={!file || state === "uploading" || state === "processing"}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-2 text-sm font-semibold text-black shadow-sm shadow-black/40 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-zinc-50"
          >
            {state === "uploading" || state === "processing" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <span>⚡</span>
                Process PDF
              </>
            )}
          </button>

          {state === "success" && downloadUrl && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-black px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900"
            >
              <span>↓</span>
              Download Normalized PDF
            </button>
          )}

          {(state === "success" || state === "error") && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-xl border border-zinc-800 bg-black/80 p-5 text-xs text-zinc-500 sm:p-6">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">
          How it works
        </h3>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            Extracts all embedded images from your PDF document
          </li>
          <li>
            Resizes each image to fit within the target dimensions while
            preserving aspect ratio
          </li>
          <li>
            Pads images with white backgrounds to match the exact target size
          </li>
          <li>
            Rebuilds the PDF with normalized images using high-quality LANCZOS
            resampling
          </li>
        </ul>
      </div>
    </div>
  );
}

