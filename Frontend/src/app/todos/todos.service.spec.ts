import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('TodosService', () => {
  let service: TodosService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TodosService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('當呼叫getTodos的時候，應該呼叫httpClient.get', () => {
    // Arrange
    spyOn(httpClient, 'get');
    const expectedEndpoint = `${environment.api}/todo`;

    // Act
    service.getTodos();

    // Assert
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(httpClient.get).toHaveBeenCalledWith(expectedEndpoint);
  });

  it('當呼叫addTodos的時候，應該呼叫httpClient.post', () => {
    // Arrange
    spyOn(httpClient, 'post');
    const expectedEndpoint = `${environment.api}/todo`;
    const expectedBody = { text: 'demo' };
    // Act
    service.addTodo('demo');

    // Assert
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(httpClient.post).toHaveBeenCalledWith(expectedEndpoint, expectedBody);
  });

  it('當呼叫toggleComplete的時候，應該呼叫httpClient.put', () => {
    // Arrange
    spyOn(httpClient, 'put');
    const expectedEndpoint = `${environment.api}/todo`;
    const expectedBody = { id: 1, completed: false };
    // Act
    service.toggleComplete({
      id: 1,
      text: '',
      completed: true
    });

    // Assert
    expect(httpClient.put).toHaveBeenCalledTimes(1);
    expect(httpClient.put).toHaveBeenCalledWith(expectedEndpoint, expectedBody);
  });
});
