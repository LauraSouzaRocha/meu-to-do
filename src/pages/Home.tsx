/**
 * @file src/pages/Home.tsx
 * @description Dashboard de tarefas (CRUD) para usuário autenticado.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth/hooks/useAuth";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
} from "@/services/tasks/task.service";

import type { Task, CreateTaskInput, UpdateTaskInput } from "@/services/tasks/task.types";

import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ------ DELETE CONFIRMATION ------
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ------ UPDATE CONFIRMATION ------
  const [pendingUpdate, setPendingUpdate] = useState<UpdateTaskInput | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleCreate = async (input: CreateTaskInput) => {
    try {
      await createTask(input);
      toast.success("Tarefa criada");
      await fetchTasks();
    } catch {
      toast.error("Falha ao criar tarefa");
    }
  };

  // ---- UPDATE ----
  const handleUpdate = (input: UpdateTaskInput) => {
    // abrir diálogo de confirmação
    setPendingUpdate(input);
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!pendingUpdate) return;
    try {
      await updateTask(pendingUpdate);
      toast.success("Tarefa atualizada");
      setEditingTask(null);
      await fetchTasks();
    } catch {
      toast.error("Erro ao atualizar tarefa");
    } finally {
      setPendingUpdate(null);
      setUpdateDialogOpen(false);
    }
  };

  // ---- DELETE ----
  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      toast.success("Tarefa excluída");
      await fetchTasks();
    } catch {
      toast.error("Erro ao excluir tarefa");
    } finally {
      setTaskToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado");
      navigate("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-2xl">Dashboard de Tarefas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Usuário: <span className="font-medium">{user?.email}</span>
          </p>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </CardHeader>

        <CardContent>
          {/* Formulário – criar ou editar */}
          {editingTask ? (
            <TaskForm
              initialValues={editingTask}
              onSubmit={handleUpdate}
              submitLabel="Salvar"
              onCancel={() => setEditingTask(null)}
            />
          ) : (
            <TaskForm onSubmit={handleCreate} submitLabel="Criar" />
          )}

          {/* Lista de tarefas */}
          <div className="mt-6">
            <TaskList
              tasks={tasks}
              loading={loading}
              onRefresh={fetchTasks}
              onToggle={toggleTaskCompleted}
              onEdit={(t) => setEditingTask(t)}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground">
          Atualizado em {new Date().toLocaleString()}
        </CardFooter>
      </Card>

      {/* ---------- DELETE CONFIRMATION DIALOG ---------- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---------- UPDATE CONFIRMATION DIALOG ---------- */}
      <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente salvar as alterações desta tarefa?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
