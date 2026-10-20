"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export default function NewTaskPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const task = {
      title: String(formData.get("title") ?? "").trim(),
      dueDate: String(formData.get("dueDate") ?? ""),
      subject: String(formData.get("subject") ?? "").trim(),
      priority: String(formData.get("priority") ?? "medium"),
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "L’ajout de la tâche a échoué.");
      }

      router.push("/tasks");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Une erreur est survenue.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900">
      <section className="mx-auto max-w-2xl px-6 pb-16 pt-8 sm:px-10 sm:pt-12">
        <p className="mb-3 text-sm font-medium text-emerald-700">Un pas à la fois</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Nouvelle tâche</h1>
        <p className="mt-3 text-slate-600">Ajoute une tâche pour garder le fil de tes études.</p>

        <form onSubmit={handleSubmit} className="mt-9 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <label htmlFor="title" className="text-sm font-semibold text-slate-800">Titre <span className="text-red-600">*</span></label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="Ex. Réviser le chapitre 3"
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="text-sm font-semibold text-slate-800">Échéance</label>
            <input id="dueDate" name="dueDate" type="date" className={fieldClassName} />
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-semibold text-slate-800">Matière</label>
            <input id="subject" name="subject" type="text" placeholder="Ex. Histoire" className={fieldClassName} />
          </div>

          <div>
            <label htmlFor="priority" className="text-sm font-semibold text-slate-800">Priorité</label>
            <select id="priority" name="priority" defaultValue="medium" className={fieldClassName}>
              <option value="low">Low — basse</option>
              <option value="medium">Medium — moyenne</option>
              <option value="high">High — haute</option>
            </select>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link href="/tasks" className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Ajout en cours…" : "Ajouter la tâche"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
