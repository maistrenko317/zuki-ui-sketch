import { HttpError } from './http-error';

export class ZukiErrorResponse<T> extends HttpError {
  constructor(public response: T) {
    super('Http response error.  This should be handled in-app.');

    Object.setPrototypeOf(this, ZukiErrorResponse.prototype);
  }
}
