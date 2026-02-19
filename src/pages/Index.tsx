import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, CheckCircle2, Circle } from "lucide-react";

type Filter = "all" | "pending" | "completed";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const { data: tasks, isLoading, error } = useTasks();

  const filtered = tasks?.filter((t) => {
    if (filter === "pending") return t.status === "pending";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  const pendingCount = tasks?.filter((t) => t.status === "pending").length ?? 0;
  const completedCount = tasks?.filter((t) => t.status === "completed").length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Task Manager
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your daily tasks — create, edit, and track progress.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Stats + Add */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Circle className="h-3.5 w-3.5" /> {pendingCount} pending
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" /> {completedCount} done
            </span>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Add Task
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6">
            <TaskForm onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1">
          {(["all", "pending", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading tasks...</div>
        ) : error ? (
          <div className="py-12 text-center text-destructive">Failed to load tasks.</div>
        ) : filtered && filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <ClipboardList className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-lg font-medium text-muted-foreground">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {filter === "all" ? "Create your first task to get started." : "Try a different filter."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
