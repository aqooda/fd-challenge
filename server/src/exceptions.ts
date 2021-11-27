import { BadRequestException, ValidationError } from '@nestjs/common';

type ErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'INVALID_ACCESS_TOKEN'
  | 'INVALID_REFRESH_TOKEN'
  | 'ACCESS_TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_EXPIRED'
  | 'SYSTEM_ERROR'
  | 'VALIDATION_ERROR';

interface ErrorResponse {
  code: string;
  message: string;
  details: string | string[] | null;
}

const errorMap = new Map<ErrorCode, Omit<ErrorResponse, 'details'>>([
  ['INVALID_CREDENTIALS', { code: 'AUTH-001', message: 'Invalid email or password' }],
  ['INVALID_ACCESS_TOKEN', { code: 'AUTH-002', message: 'Invalid access token' }],
  ['INVALID_REFRESH_TOKEN', { code: 'AUTH-003', message: 'Invalid refresh token' }],
  ['ACCESS_TOKEN_EXPIRED', { code: 'AUTH-004', message: 'Access token expired' }],
  ['REFRESH_TOKEN_EXPIRED', { code: 'AUTH-005', message: 'Refresh token expired' }],
  ['SYSTEM_ERROR', { code: 'GENERAL-001', message: 'System error' }],
  ['VALIDATION_ERROR', { code: 'GENERAL-002', message: 'Validation error' }],
]);

function findAllValidationErrorConstraints(errors: ValidationError[]): string[] {
  return errors
    .map(({ constraints, children }) =>
      !children?.length ? Object.values(constraints) : findAllValidationErrorConstraints(children).flat(),
    )
    .flat();
}

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super(getErrorResponse('VALIDATION_ERROR', findAllValidationErrorConstraints(errors)));
  }
}

export const getErrorResponse = (code: ErrorCode, details: ErrorResponse['details'] = null) => ({
  ...errorMap.get(code),
  details,
});
