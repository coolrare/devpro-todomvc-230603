import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TodosService } from './todos.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [TodosComponent],
    });
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('當元件產生時，應該要呼叫todoService.getTodos，並且儲存得到的資料', () => {
    // Arrange
    const expected = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: true },
    ];

    const todoService = TestBed.inject(TodosService);
    spyOn(todoService, 'getTodos').and.returnValue(of(expected));

    // Act
    component.ngOnInit();

    // Assert
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(component.todos).toEqual(expected);
  });

  it('當取得todos資料後，要顯示在畫面上', () => {
    // Arrange
    const data = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: true },
    ];

    // Act
    component.todos = data;
    fixture.detectChanges();
    const actual = fixture.debugElement.queryAll(By.css('ul'));

    // Assert
    expect(actual.length).toBe(data.length);
  });

  it('當沒有輸入任何文字時，呼叫 addTodo 不應該執行到 todosService.addTodo', () => {
    // Arrange
    const todoService = TestBed.inject(TodosService);
    spyOn(todoService, 'addTodo').and.returnValue(of());
    component.todoText.setValue('');

    // Act
    component.addTodo();

    // Assert
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });

  it('當有輸入文字時，呼叫 addTodo 應該執行 todosService.addTodo', () => {
    // Arrange
    const todoService = TestBed.inject(TodosService);
    spyOn(todoService, 'addTodo').and.returnValue(of());
    component.todoText.setValue('demo');

    // Act
    component.addTodo();

    // Assert
    expect(todoService.addTodo).toHaveBeenCalledWith('demo');
  });

  it('當 addTodo 執行完後，應該重新抓取資料，並且重設定文字', () => {
    // Arrange
    const todoService = TestBed.inject(TodosService);
    spyOn(todoService, 'addTodo').and.returnValue(of({}));
    spyOn(component, 'loadTodos');
    component.todoText.setValue('demo');

    // Act
    component.addTodo();

    // Assert
    expect(todoService.addTodo).toHaveBeenCalledWith('demo');
    expect(component.loadTodos).toHaveBeenCalled();
    expect(component.todoText.value).toBe(null);
  });
});
