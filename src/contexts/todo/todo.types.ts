export interface User {
  id: string;
  email: string;
  full_name: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
