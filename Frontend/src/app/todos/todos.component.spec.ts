import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [TodosComponent],
    });
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('元件建立時，應該顯示查詢到的 todo list', () => {
    // Arrange
    const todos = [
      { id: 1, text: 'test1', completed: false },
      { id: 2, text: 'test2', completed: true },
    ];

    spyOn(component, 'loadTodos').and.callThrough();
    spyOn(component['todosService'], 'getTodos').and.returnValue(of(todos));

    // Act
    component.ngOnInit();
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('li'));

    // Assert
    expect(component.loadTodos).toHaveBeenCalledTimes(1);
    expect(component.todos).toEqual(todos);
    expect(items.length).toBe(2);
  });

  it('執行 addTodo() 時，應該呼叫 todosService.addTodo() 一次，之後重新查詢', () => {
    // Arrange
    spyOn(component['todosService'], 'addTodo').and.returnValue(of(''));
    spyOn(component, 'loadTodos').and.callThrough();

    // Act
    component.todoText.setValue('test');
    component.addTodo();

    // Assert
    expect(component['todosService'].addTodo).toHaveBeenCalledOnceWith('test');
    expect(component.loadTodos).toHaveBeenCalledTimes(1);
  });

  it('執行 updateTodo() 時，應該呼叫 todosService.updateTodo() 一次，之後重新查詢', () => {
    // Arrange
    spyOn(component['todosService'], 'toggleComplete').and.returnValue(of(''));
    spyOn(component, 'loadTodos').and.callThrough();
    const item = { id: 1, text: 'test', completed: false };

    // Act
    component.toggleComplete(item);

    // Assert
    expect(component['todosService'].toggleComplete).toHaveBeenCalledOnceWith(item);
    expect(component.loadTodos).toHaveBeenCalledTimes(1);
  });
});
