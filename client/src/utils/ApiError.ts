import { ApiErrorResponse } from '@/types/api';

export class ApiError extends Error {
  code: string;
  message: string;
  details: string | string[] | null;

  constructor({ code, message, details }: ApiErrorResponse) {
    super(message);

    this.code = code;
    this.message = message;
    this.details = details;
  }
}
