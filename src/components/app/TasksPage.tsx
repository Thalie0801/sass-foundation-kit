import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mockTasks, TaskItem, TaskStatus } from "@/lib/mockAppData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const columns: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "À faire" },
  { status: "doing", label: "En cours" },
  { status: "done", label: "Fait" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(() => mockTasks.map((task) => ({ ...task })));

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tâches</h1>
          <p className="text-sm text-muted-foreground">
            Suivez la production opérationnelle et reliez chaque tâche à son contenu parent.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/tasks/new">Nouvelle tâche</Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {columns.map(({ status, label }) => (
          <div key={status} className="flex flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="font-medium">{label}</span>
              <Badge variant="secondary">{tasks.filter((task) => task.status === status).length}</Badge>
            </div>
            <div className="flex-1 space-y-3 px-3 py-4">
              {tasks.filter((task) => task.status === status).length > 0 ? (
                tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <article key={task.id} className="space-y-3 rounded border bg-background p-3">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          Assigné à {task.assignee}
                          {task.dueDate ? ` • Échéance ${task.dueDate}` : ""}
                        </p>
                      </div>
                      {task.contentId && (
                        <Link to={`/app/contents/${task.contentId}`} className="inline-flex text-sm text-primary hover:underline">
                          Voir le contenu associé
                        </Link>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            Déplacer vers…
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {columns.map((column) => (
                            <DropdownMenuItem
                              key={column.status}
                              disabled={column.status === task.status}
                              onSelect={() => moveTask(task.id, column.status)}
                            >
                              {column.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </article>
                  ))
              ) : (
                <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Rien à afficher ici.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
