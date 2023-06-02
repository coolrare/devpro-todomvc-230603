import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TodoItem } from './todo-item';

describe('TodosService', () => {
  let service: TodosService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TodosService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('執行 getTodos() 時，應該從 API 取回所有 todo list', () => {
    // Arrange
    const data = [
      { id: 1, text: 'task 1', completed: false },
      { id: 2, text: 'task 2', completed: true },
    ];
    spyOn(httpClient, 'get').and.returnValue(of(data));

    // Act
    service.getTodos().subscribe((result) => {
      expect(result).toEqual(data);
    });

    // Assert
    expect(httpClient.get).toHaveBeenCalledOnceWith(`${environment.api}/todo`);
  });

  it('執行 addTodo() 時，應該呼叫 httpClient.post() 一次', () => {
    // Arrange
    spyOn(httpClient, 'post');

    // Act
    service.addTodo('task 1');

    // Assert
    expect(httpClient.post).toHaveBeenCalledOnceWith(
      `${environment.api}/todo`,
      { text: 'task 1' }
    );
  });

  it('執行 toggleComplete() 時，應該呼叫 httpClient.put() 一次', () => {
    // Arrange
    spyOn(httpClient, 'put');

    // Act
    const item = <TodoItem>{ id: 1, text: 'task 1', completed: false };
    service.toggleComplete(item);

    // Assert
    expect(httpClient.put).toHaveBeenCalledOnceWith(`${environment.api}/todo`, {
      id: 1,
      // 原來 completed 是 false，所以這裡要傳 true
      completed: true,
    });
  });
});
