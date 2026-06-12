import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/tasks.service";
import type { Task } from "../todo.types";

export const useTasks = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks", userId],
    queryFn: () => fetchTasks(userId!),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", userId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => updateTask(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", userId] }),
  });

  return {
    tasks,
    isLoading,
    isError,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  };
};
