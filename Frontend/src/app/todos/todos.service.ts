import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoItem } from './todo-item';
import { Observable, delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private httpClient: HttpClient) {}

  getTodos(): Observable<Array<TodoItem>> {
    return this.httpClient.get<Array<TodoItem>>(`${environment.api}/todo`);
  }

  addTodo(text: string): Observable<any> {
    return this.httpClient.post(`${environment.api}/todo`, { text });
  }

  toggleComplete(item: TodoItem): Observable<any> {
    return this.httpClient.put(`${environment.api}/todo`, {
      id: item.id,
      completed: !item.completed,
    });
  }
}
