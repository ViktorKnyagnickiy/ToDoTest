import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';
  sortBy: 'low' | 'medium' | 'high' | '' = '';

  newTodoTitle = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'low';

  editingTodo: Todo | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    const newTodo: Todo = {
      title: this.newTodoTitle,
      completed: false,
      priority: this.newTodoPriority
    };

    this.todoService.addTodo(newTodo).subscribe(todo => {
      this.todos.push(todo);
      this.newTodoTitle = '';
    });
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
    });
  }

  startEdit(todo: Todo) {
    this.editingTodo = { ...todo };
  }

  saveEdit() {
    if (this.editingTodo) {
      this.todoService.updateTodo(this.editingTodo).subscribe(updated => {
        this.todos = this.todos.map(t => t.id === updated.id ? updated : t);
        this.editingTodo = null;
      });
    }
  }

  cancelEdit() {
    this.editingTodo = null;
  }

  get filteredTodos() {
    let filtered = [...this.todos];

    if (this.filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.filter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    }

    if (this.sortBy) {
      const order = { low: 1, medium: 2, high: 3 };
      filtered.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return filtered;
  }
}
