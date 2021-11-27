import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { getErrorResponse } from './exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const accessToken =
        request.headers['authorization']?.replace('Bearer ', '') ?? (request.query.accessToken as string);

      if (!accessToken) {
        throw new UnauthorizedException(getErrorResponse('INVALID_ACCESS_TOKEN'));
      }

      this.jwtService.verify(accessToken);

      return true;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException(getErrorResponse('ACCESS_TOKEN_EXPIRED'));
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException(getErrorResponse('INVALID_ACCESS_TOKEN'));
      }

      throw err;
    }
  }
}
