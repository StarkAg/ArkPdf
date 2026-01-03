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
          <div className="flex min-h-screen w-full flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <header className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                ArkPDF – Powered Document Transformation
              </h1>
            </header>
            <main className="flex-1">{children}</main>
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
