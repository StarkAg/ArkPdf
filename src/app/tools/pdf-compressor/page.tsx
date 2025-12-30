export default function PDFCompressorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            PDF Compressor
          </h1>
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Smart compression profiles tuned for print, web, and archival workflows.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-black/70 p-12 text-center shadow-inner shadow-black/70">
        <div className="mx-auto max-w-md space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl text-zinc-500">
            📦
          </div>
          <h3 className="text-lg font-semibold text-zinc-200">
            PDF Compressor
          </h3>
          <p className="text-sm text-zinc-500">
            This tool is currently in development. Check back soon for smart
            compression capabilities with customizable quality profiles.
          </p>
        </div>
      </div>
    </div>
  );
}

