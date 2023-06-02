import { Component, OnInit } from '@angular/core';
import { TodosService } from './todos.service';
import { TodoItem } from './todo-item';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todoText = new FormControl('');
  todos: Array<TodoItem> = [];

  constructor(
    private loadingService: LoadingService,
    private todosService: TodosService
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.loadingService.loading();
    this.todosService
      .getTodos()
      .pipe(finalize(() => this.loadingService.unloading()))
      .subscribe((todos) => {
        this.todos = todos;
      });
  }

  addTodo() {
    if (this.todoText) {
      this.loadingService.loading();
      this.todosService.addTodo(this.todoText.value || '').subscribe(() => {
        this.loadTodos();
        this.todoText.reset();
      });
    }
  }

  toggleComplete(item: TodoItem) {
    this.loadingService.loading();
    this.todosService.toggleComplete(item).subscribe(() => {
      this.loadTodos();
    });
  }
}
