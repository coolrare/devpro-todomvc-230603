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

  beforeEach(() => {
    const div = document.querySelectorAll('.loading-container');
    div.forEach((elm) => {
      elm?.remove();
    });
  });

  describe('當呼叫loading方法時', () => {
    it('應該要產生一個loadingElement', () => {
      // Arrange

      // Act
      expect(service.loadingElement).toBeFalsy();
      service.loading();

      // Assert
      expect(service.loadingElement).toBeTruthy();
    });

    it('應該要有一個loading-container的元素出現', () => {
      // Arrange

      // Act
      const div = document.querySelector('.loading-container');
      expect(div).toBeFalsy();

      service.loading();
      const actual = document.querySelector('.loading-container');

      // Assert
      expect(actual).toBeTruthy();
    });

    it('不應該重複產生loadingElement', () => {
      // Arrange

      // Act
      service.loading();
      const elm1 = service.loadingElement;

      service.loading();
      const elm2 = service.loadingElement;

      // Assert
      expect(elm1).toBe(elm2);
    })
  });

  describe('當 unloading 呼叫時', () => {
    it('loadingElement 應該不存在', () => {
      // Arrange

      // Act
      service.loading();
      service.unloading();

      // Assert
      expect(service.loadingElement).toBeFalsy();
    });

    it('loading-container的元素應該不存在', () => {
      service.loading();
      service.unloading();
      const actual = document.querySelector('.loading-container');

      expect(actual).toBeFalsy();
    });
  })
});
