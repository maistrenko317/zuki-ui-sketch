import { ShoutError } from './shout-error';

export class HttpError extends ShoutError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
