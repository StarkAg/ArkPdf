"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const tools = [
  {
    href: "/tools/image-size-normalizer",
    label: "Image Size Normalizer",
    badge: "Core",
    badgeColor: "text-emerald-300",
  },
  {
    href: "/tools/pdf-compressor",
    label: "PDF Compressor",
    badge: "Soon",
    badgeColor: "text-slate-500",
  },
  {
    href: "/tools/pdf-merger",
    label: "PDF Merger",
    badge: "Soon",
    badgeColor: "text-slate-500",
  },
  {
    href: "/tools/ocr-extractor",
    label: "OCR Extractor",
    badge: "Soon",
    badgeColor: "text-slate-500",
  },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-inner shadow-black/40">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Tools
          </p>
          <p className="mt-1 text-sm text-slate-300/80">
            Modular actions you can combine into custom document pipelines.
          </p>
        </div>
        <nav className="space-y-1 text-sm">
          {tools.map((tool) => {
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/60"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
                }`}
              >
                <span>{tool.label}</span>
                <span
                  className={`text-[10px] font-semibold uppercase ${
                    isActive ? "text-emerald-300" : tool.badgeColor
                  }`}
                >
                  {tool.badge}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/40 sm:p-6 lg:p-7">
        {children}
      </section>
    </div>
  );
}


