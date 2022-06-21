import { Injectable } from '@angular/core';

@Injectable()
export class BaseImageStoreService<T> {
  private storedImages: Dict<T> = {};

  setStoredImage(img: string, store: T): void {
    this.storedImages[img] = store;
  }

  getStoredImage(img: string): T | undefined {
    return img ? this.storedImages[img] : undefined;
  }
}
