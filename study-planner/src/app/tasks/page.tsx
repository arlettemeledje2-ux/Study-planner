"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  id: string | number;
  title: string;
  dueDate: string;
  completed: boolean;
  subject?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("La récupération des tâches a échoué.");
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("La réponse de l’API est invalide.");
        setTasks(data as Task[]);
      } catch {
        setError("Impossible de charger les tâches. Réessaie plus tard.");
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function deleteTask(task: Task) {
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) return;

    setDeletingId(task.id);
    setError(null);
    try {
      const response = await fetch(`/api/tasks?id=${encodeURIComponent(String(task.id))}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "La suppression a échoué.");
      }
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Impossible de supprimer cette tâche.");
    } finally {
      setDeletingId(null);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-10 sm:pt-12">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-emerald-700">Ton espace de travail</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Mes tâches</h1>
            <p className="mt-3 text-slate-600">Garde un œil sur tes échéances et avance à ton rythme.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!loading && !error && (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-sm">
                <span className="font-semibold text-slate-900">{completedCount} / {tasks.length}</span> terminée{completedCount > 1 ? "s" : ""}
              </div>
            )}
            <Link href="/tasks/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
              + Nouvelle tâche
            </Link>
          </div>
        </div>

        {loading ? (
          <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <span className="inline-block animate-spin" aria-hidden="true">◌</span>
            <span className="ml-2">Chargement des tâches…</span>
          </div>
        ) : error ? (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Aucune tâche pour le moment.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="flex min-h-48 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.03] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {task.subject && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">{task.subject}</p>}
                    <h2 className="text-lg font-semibold leading-snug">{task.title}</h2>
                  </div>
                  <span
                    aria-label={task.completed ? "Tâche terminée" : "Tâche à faire"}
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                      task.completed ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </div>
                <div className="mt-7 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Échéance : {task.dueDate}</span>
                    <span className={`font-medium ${task.completed ? "text-emerald-700" : "text-amber-700"}`}>
                      {task.completed ? "Terminée" : "À faire"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteTask(task)}
                    disabled={deletingId === task.id}
                    className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Supprimer la tâche ${task.title}`}
                  >
                    <span aria-hidden="true">×</span>
                    {deletingId === task.id ? "Suppression en cours…" : "Supprimer la tâche"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
