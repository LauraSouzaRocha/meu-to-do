/**
 * @file src/services/tasks/task.service.ts
 * @description CRUD operations for tasks using Supabase.
 */

import { supabase } from "@/lib/supabase";
import type { Task, CreateTaskInput, UpdateTaskInput } from "./task.types";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: user.id,
        title: input.title,
        description: input.description,
        completed: false,
      },
    ])
    .select();

  console.log("INSERT RESULT:", data);
  console.log("INSERT ERROR:", error);

  if (error) throw error;

  return data![0] as Task;
}

export async function getTasks(): Promise<Task[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from<Task>('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { id, ...updates } = input;
  const { data, error } = await supabase
    .from<Task>('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from<Task>('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleTaskCompleted(id: string, completed: boolean): Promise<Task> {
  const { data, error } = await supabase
    .from<Task>('tasks')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
