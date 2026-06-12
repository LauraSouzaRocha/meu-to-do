import { supabase } from "@/lib/supabase";
import type { Task } from "../todo.types";

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Task[];
};

export const createTask = async (task: { title: string; description?: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Task;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
};
