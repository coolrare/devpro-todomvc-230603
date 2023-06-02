import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loading 與 unloading 的屬性操作', () => {
    beforeEach(() => {
      // 清除 .loading-container
      const loadingContainer =
        document.body.querySelectorAll('.loading-container');
      loadingContainer.forEach((element) => element.remove());
    });

    it('當執行 loading() 時，應該產生一個 loadingElement 的屬性', () => {
      // Act
      service.loading();

      // Assert
      expect(service.loadingElement).toBeTruthy();
    });

    it('在 unloading() 執行前重複執行 loading() 時，應該只產生一個 loadingElement 的屬性', () => {
      // Act
      service.loading();
      const loadingElement1 = service.loadingElement;
      service.loading();
      const loadingElement2 = service.loadingElement;

      // Assert
      expect(loadingElement1).toBe(loadingElement2);
    });

    it('當執行 unloading() 時，應該將 loadingElement 的屬性設為 undefined', () => {
      // Arrange
      service.loading();

      // Act
      service.unloading();

      // Assert
      expect(service.loadingElement).toBeUndefined();
    });
  });

  describe('loading 與 unloading 的 DOM 物件操作', () => {
    beforeEach(() => {
      // 清除 .loading-container
      const loadingContainer =
        document.body.querySelectorAll('.loading-container');
      loadingContainer.forEach((element) => element.remove());
    });

    it('當執行 loading() 時，應該將畫面遮罩住', () => {
      // Act
      service.loading();
      const actual = document.body.querySelector('.loading-container');

      // Assert
      expect(actual).toBeTruthy();
    });

    it('當執行 unloading() 時，遮罩的畫面應該被移除', () => {
      // Arrange

      // Act
      // loading 時有遮罩畫面
      service.loading();
      // unloading 後應該沒有遮罩畫面
      service.unloading();

      const actual = document.body.querySelector('.loading-container');

      // Assert
      expect(actual).toBeFalsy();
    });
  });
});
