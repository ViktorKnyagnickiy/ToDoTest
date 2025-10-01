export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}
