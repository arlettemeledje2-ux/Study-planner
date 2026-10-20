import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const tasksFilePath = join(process.cwd(), "data", "tasks.json");

type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  [key: string]: unknown;
};

async function readTasks(): Promise<Task[]> {
  try {
    const contents = await readFile(tasksFilePath, "utf8");
    if (!contents.trim()) return [];

    const parsed: unknown = JSON.parse(contents);
    // Accepte la liste directe et le format { tasks: [...] } déjà présent dans le fichier.
    const tasks = Array.isArray(parsed)
      ? parsed
      : typeof parsed === "object" && parsed !== null && "tasks" in parsed
        ? parsed.tasks
        : null;
    if (!Array.isArray(tasks)) throw new Error("Le fichier de tâches doit contenir une liste.");
    return tasks as Task[];
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

export async function GET() {
  try {
    return NextResponse.json(await readTasks());
  } catch {
    return NextResponse.json({ error: "Impossible de lire les tâches." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "L’identifiant de la tâche est requis." }, { status: 400 });
  }

  try {
    const tasks = await readTasks();
    const remainingTasks = tasks.filter((task) => String(task.id) !== id);
    if (remainingTasks.length === tasks.length) {
      return NextResponse.json({ error: "Tâche introuvable." }, { status: 404 });
    }

    await writeFile(tasksFilePath, `${JSON.stringify({ tasks: remainingTasks }, null, 2)}\n`, "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Impossible de supprimer la tâche." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Le corps de la requête doit être un JSON valide." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("title" in body) ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    !("dueDate" in body) ||
    typeof body.dueDate !== "string"
  ) {
    return NextResponse.json(
      { error: "Les champs title (texte) et dueDate (texte) sont requis." },
      { status: 400 },
    );
  }

  try {
    const tasks = await readTasks();
    const newTask: Task = {
      ...body,
      id: randomUUID(),
      title: body.title.trim(),
      dueDate: body.dueDate,
      completed: "completed" in body && typeof body.completed === "boolean" ? body.completed : false,
    };

    tasks.push(newTask);
    await writeFile(tasksFilePath, `${JSON.stringify({ tasks }, null, 2)}\n`, "utf8");

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d’enregistrer la tâche." }, { status: 500 });
  }
}
