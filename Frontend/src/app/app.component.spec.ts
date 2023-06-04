import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('必須包含 router-outlet', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act

    // Assert
    const debugElement = fixture.debugElement.query(By.css('router-outlet'));
    expect(debugElement.nativeElement).toBeTruthy();
  });
});
