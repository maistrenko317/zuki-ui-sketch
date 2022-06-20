export class MockError extends Error {
  private errorName?: string;

  constructor(errorName: string, message?: string) {
    super(message ? message : errorName);

    if (message) {
      this.errorName = errorName;
    }

    Object.setPrototypeOf(this, MockError.prototype);
  }
}
