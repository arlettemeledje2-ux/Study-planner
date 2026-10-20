import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Studyspace — ton espace d’étude",
  description: "Organise tes tâches et tes échéances d’étudiant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pt-[72px]">
        <nav aria-label="Navigation principale" className="fixed inset-x-0 top-0 z-50 border-b border-slate-700 bg-slate-900 text-white shadow-md">
          <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
            <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-lg text-lime-300">s.</span>
              <span className="hidden sm:inline">studyspace</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white">Accueil</Link>
              <Link href="/tasks" className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white">Tâches</Link>
              <Link href="/tasks/new" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">Nouvelle tâche</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
