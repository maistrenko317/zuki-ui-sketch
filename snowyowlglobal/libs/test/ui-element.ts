export interface UIElement {
  text(): Promise<string>;
  exists(): Promise<boolean>;

  waitForExist(timeout?: number): Promise<void>;

  sendKeys(keys: string): Promise<void>;
  clear(): Promise<void>;
  click(): Promise<void>;
}
