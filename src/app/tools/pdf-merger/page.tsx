export default function PDFMergerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            PDF Merger
          </h1>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-slate-300/80">
          Deterministic merging with page range selection and sequence controls.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-12 text-center shadow-inner shadow-black/40">
        <div className="mx-auto max-w-md space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl text-slate-500">
            🔀
          </div>
          <h3 className="text-lg font-semibold text-slate-200">PDF Merger</h3>
          <p className="text-sm text-slate-400">
            This tool is currently in development. Check back soon for advanced
            PDF merging capabilities with page range selection and custom ordering.
          </p>
        </div>
      </div>
    </div>
  );
}

