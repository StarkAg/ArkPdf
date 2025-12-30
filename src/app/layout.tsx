import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArkPDF – Powered Document Transformation",
  description:
    "ArkPDF is a multi-tool platform for intelligent PDF and document transformation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-50`}
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff0f,_transparent_55%),linear-gradient(to_bottom,_#020202,_#050505)]">
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200 shadow-sm shadow-black/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-100" />
                  Live · ArkPDF
                </div>
                <h1 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  ArkPDF – Powered Document Transformation
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Multi-tool PDF workspace for teams that care about precision,
                  performance, and control.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 shadow-sm shadow-black/60 sm:flex">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-black">
                  ⚡
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">Image Size Normalizer</span>
                  <span className="text-[11px] text-slate-400">
                    GPU-friendly, production-ready pipeline
                  </span>
                </div>
              </div>
            </header>
            <main className="mt-6 flex-1">{children}</main>
            <footer className="mt-8 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
              ArkPDF &copy; {new Date().getFullYear()} · Built for modern
              document workflows.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
