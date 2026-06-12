/**
 * @file src/components/tasks/TaskList.tsx
 * @description List component that shows tasks, loading spinner and empty state.
 */

import { toast } from "sonner";

import { TaskItem } from "./TaskItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import type { Task } from "@/services/tasks/task.types";

type Props = {
  tasks: Task[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onToggle: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
};

export const TaskList = ({ tasks, loading, onRefresh, onToggle, onEdit, onDelete }: Props) => {
  if (loading) return <LoadingSpinner />;

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhuma tarefa ainda.</p>;
  }

  return (
    <div>
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={async (task) => {
            try {
              await onToggle(task);
              await onRefresh();
              toast.success("Status atualizado");
            } catch {
              toast.error("Falha ao atualizar status");
            }
          }}
          onEdit={onEdit}
          onDelete={async (task) => {
            if (window.confirm("Excluir esta tarefa?")) {
              try {
                await onDelete(task);
                await onRefresh();
                toast.success("Tarefa excluída");
              } catch {
                toast.error("Erro ao excluir tarefa");
              }
            }
          }}
        />
      ))}
    </div>
  );
};
