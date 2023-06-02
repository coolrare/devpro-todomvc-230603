import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingElement?: HTMLElement;

  constructor() {}

  loading() {
    if (!this.loadingElement) {
      this.loadingElement = document.createElement('div');
      this.loadingElement.classList.add('loading-container');
      document.body.append(this.loadingElement);
    }
  }

  unloading() {
    this.loadingElement?.remove();
    this.loadingElement = undefined;
  }
}
