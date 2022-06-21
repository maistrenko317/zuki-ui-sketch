import { BaseLocalStorage } from '@snowl/base-app/shared';

export class LocalStorage extends BaseLocalStorage {
  set(key: string, item: string) {
    localStorage.setItem(key, item);
  }
  get(key: string): string | undefined {
    return localStorage.getItem(key) || undefined;
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
