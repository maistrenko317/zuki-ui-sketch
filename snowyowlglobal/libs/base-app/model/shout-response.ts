export interface TicketResponse {
  ticket: string;
  estimatedWaitTime: number;
  encryptKey: string;
}

interface ShoutResponseBase {
  success: boolean;
  ticketResponse?: TicketResponse;
  subscriberNotFound?: true;
  message?: string;
}
export type PossibleHttpError = true | undefined;

export type ShoutResponse<Errors extends string = never> = ShoutResponseBase & {
  [Error in Errors]?: PossibleHttpError;
};

export type ShoutResponseErrors<T extends ShoutResponse> = {[k in keyof T]?: T[k] extends PossibleHttpError ? PossibleHttpError : never};
