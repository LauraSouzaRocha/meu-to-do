/**
 * @file src/components/tasks/TaskItem.tsx
 * @description UI for a single task with actions.
 */

import { CheckSquare, Square, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import type { Task } from "@/services/tasks/task.types";

type Props = {
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
};

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: Props) => (
  <Card className="mb-2">
    <CardContent className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onToggle(task)}>
          {task.completed ? (
            <CheckSquare className="text-primary" />
          ) : (
            <Square className="text-muted-foreground" />
          )}
          <span className="sr-only">Toggle completed</span>
        </Button>
        <div className={task.completed ? "line-through text-muted-foreground" : ""}>
          <p className="font-medium">{task.title}</p>
          {task.description && <p className="text-sm">{task.description}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
          <Edit className="text-muted-foreground" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
          <Trash2 className="text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </CardContent>
    <CardFooter className="text-xs text-muted-foreground">
      Criado em {new Date(task.created_at).toLocaleDateString()}
    </CardFooter>
  </Card>
);
