export abstract class BaseLocalStorage {
  abstract set(key: string, item: string): void;
  abstract get(key: string): string | undefined;
  abstract remove(key: string): void;
}
