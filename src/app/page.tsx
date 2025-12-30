import Link from "next/link";

const tools = [
  {
    name: "Image Size Normalizer",
    href: "/tools/image-size-normalizer",
    badge: "Core",
    description:
      "Normalize embedded PDF images to a consistent canvas while preserving aspect ratios.",
    highlight: true,
  },
  {
    name: "PDF Compressor",
    href: "/tools/pdf-compressor",
    badge: "Coming soon",
    description:
      "Smart compression profiles tuned for print, web, and archival workflows.",
  },
  {
    name: "PDF Merger",
    href: "/tools/pdf-merger",
    badge: "Coming soon",
    description:
      "Deterministic merging with page range selection and sequence controls.",
  },
  {
    name: "OCR Extractor",
    href: "/tools/ocr-extractor",
    badge: "Coming soon",
    description:
      "Turn scans into structured, machine-readable text ready for downstream systems.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 p-6 shadow-xl shadow-emerald-500/20 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-slate-950/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Multi-tool PDF platform
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              ArkPDF – Powered Document Transformation
            </h2>
            <p className="max-w-xl text-sm text-slate-200/80 sm:text-[15px]">
              ArkPDF is your control plane for PDFs. Normalize images, compress
              files, merge flows, and extract text — all from a single,
              extensible workspace.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-white/15 bg-slate-900/70 p-4 text-xs text-slate-200 shadow-md shadow-black/40 sm:w-72">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Telemetry
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Stable
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active tools</span>
                <span className="font-mono text-emerald-200">1 / 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Latency budget</span>
                <span className="font-mono text-slate-100">&lt; 2.5s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Output fidelity</span>
                <span className="font-mono text-emerald-200">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Tools dashboard
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Pick a tool to start a transformation. Each tool is designed to
              be composed into pipelines.
            </p>
          </div>
          <Link
            href="/tools/image-size-normalizer"
            className="hidden items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-medium text-emerald-100 shadow-sm shadow-emerald-500/40 sm:inline-flex"
          >
            Jump into Image Size Normalizer
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className={`group flex flex-col justify-between rounded-2xl border px-4 py-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:py-5 ${
                tool.highlight
                  ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 shadow-emerald-500/40"
                  : "border-white/10 bg-slate-950/60 hover:border-emerald-400/40"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-slate-50">
                    {tool.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      tool.highlight
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300/80">{tool.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400/80 group-hover:bg-emerald-300" />
                  {tool.highlight ? "Ready for production flows" : "In design"}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-200 group-hover:text-emerald-100">
                  Open
                  <span aria-hidden>↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

