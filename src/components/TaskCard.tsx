import { useState } from "react";
import { type Task, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import TaskForm from "./TaskForm";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const toggleStatus = () => {
    updateTask.mutate({
      id: task.id,
      status: task.status === "pending" ? "completed" : "pending",
    });
  };

  if (isEditing) {
    return <TaskForm task={task} onClose={() => setIsEditing(false)} />;
  }

  const isCompleted = task.status === "completed";

  return (
    <div
      className={`group rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        isCompleted ? "border-border/60 opacity-70" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={toggleStatus}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 hover:border-primary"
          }`}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted && <Check className="h-3.5 w-3.5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-display font-semibold text-card-foreground transition-all ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isCompleted
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
              {isCompleted ? "Completed" : "Pending"}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteTask.mutate(task.id)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
