export abstract class ShoutError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ShoutError.prototype);
  }
}
