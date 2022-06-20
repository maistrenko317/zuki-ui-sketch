import { HttpError } from './http-error';
import { ShoutResponse } from '../model';

export class ShoutErrorResponse<T extends ShoutResponse = ShoutResponse> extends HttpError {
  constructor(public response: T) {
    super('Http response error.  This should be handled in-app.');

    Object.setPrototypeOf(this, ShoutErrorResponse.prototype);
  }
}
