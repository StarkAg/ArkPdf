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
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.85)] sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-50" />
              Multi-tool PDF platform
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              ArkPDF – Powered Document Transformation
            </h2>
            <p className="max-w-xl text-sm text-zinc-300 sm:text-[15px]">
              ArkPDF is your control plane for PDFs. Normalize images, compress
              files, merge flows, and extract text — all from a single,
              extensible workspace.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-800 bg-black/60 p-4 text-xs text-zinc-200 shadow-md shadow-black/70 sm:w-72">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                Telemetry
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Stable build
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Active tools</span>
                <span className="font-mono text-zinc-100">1 / 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Latency budget</span>
                <span className="font-mono text-zinc-50">&lt; 2.5s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Output fidelity</span>
                <span className="font-mono text-zinc-100">99.9%</span>
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
            className="hidden items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-black shadow-sm shadow-black/60 sm:inline-flex"
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
                  ? "border-zinc-100 bg-gradient-to-br from-zinc-50/5 via-black to-zinc-950 shadow-[0_14px_40px_rgba(0,0,0,0.9)]"
                  : "border-zinc-800 bg-black/60 hover:border-zinc-500"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-zinc-50">
                    {tool.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      tool.highlight
                        ? "bg-zinc-100 text-black"
                        : "bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{tool.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-zinc-200 group-hover:bg-zinc-50" />
                  {tool.highlight ? "Ready for production flows" : "In design"}
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-200 group-hover:text-zinc-50">
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

