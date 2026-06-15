/**
 * @file src/pages/Home.tsx
 * @description Dashboard de tarefas (CRUD) para usuário autenticado.
 */

import { useEffect, useState } from "react";
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

export default function Home() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleUpdate = async (input: UpdateTaskInput) => {
    try {
      await updateTask(input);
      toast.success("Tarefa atualizada");
      setEditingTask(null);
      await fetchTasks();
    } catch {
      toast.error("Erro ao atualizar tarefa");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#1e3a8a] to-[#7c3aed] bg-clip-text text-transparent">
              Meu To Do
            </h1>

            <p className="mt-2 text-violet-700 font-medium">
              Organize suas tarefas de forma simples e produtiva
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Logado como{" "}
              <span className="font-semibold text-slate-700">
                {user?.email}
              </span>
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-violet-300 text-violet-700 hover:bg-violet-50"
          >
            Sair
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* Criar tarefa */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                {editingTask ? "Editar tarefa" : "Nova tarefa"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {editingTask ? (
                <TaskForm
                  initialValues={editingTask}
                  onSubmit={handleUpdate}
                  submitLabel="Salvar"
                  onCancel={() => setEditingTask(null)}
                />
              ) : (
                <TaskForm
                  onSubmit={handleCreate}
                  submitLabel="Criar tarefa"
                />
              )}
            </CardContent>
          </Card>

          {/* Lista */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Minhas tarefas</span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700">
                  {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <TaskList
                tasks={tasks}
                loading={loading}
                onRefresh={fetchTasks}
                onToggle={toggleTaskCompleted}
                onEdit={(t) => setEditingTask(t)}
                onDelete={deleteTask}
              />
            </CardContent>

            <CardFooter className="text-xs text-muted-foreground">
              Atualizado em {new Date().toLocaleString()}
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );

}
