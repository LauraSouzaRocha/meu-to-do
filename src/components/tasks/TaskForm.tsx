/**
 * @file src/components/tasks/TaskForm.tsx
 * @description Form for creating or editing a task using React Hook Form + Zod.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { CreateTaskInput, UpdateTaskInput } from "@/services/tasks/task.types";

useEffect(() => {
  if (initialValues) {
    form.reset({
      title: initialValues.title ?? "",
      description: initialValues.description ?? "",
    });
  }
}, [initialValues, form]);
type Props = {
  initialValues?: UpdateTaskInput;
  onSubmit: (values: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
};

const schema = z.object({
  title: z.string().min(1, { message: "Título obrigatório" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const TaskForm = ({ initialValues, onSubmit, submitLabel, onCancel }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (initialValues?.id) {
        await onSubmit({ id: initialValues.id, ...values });
      } else {
        await onSubmit(values);
      }
      form.reset();
    } catch {
      // errors handled by parent via toast
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nome da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">{submitLabel}</Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
