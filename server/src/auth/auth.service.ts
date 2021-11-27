import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { RefreshTokenRecord, User } from './entities';
import { getErrorResponse } from '../exceptions';

const ACCESS_TOKEN_EXPIRES_IN = dayjs().add(1, 'm').diff(); // Milliseconds of 1 mins
const REFRESH_TOKEN_EXPIRES_IN = dayjs().add(24, 'h').diff(); // Milliseconds of 24 hours

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshTokenRecord)
    private refreshTokenRecordRepository: Repository<RefreshTokenRecord>,
  ) {}

  async findRefreshTokenRecordOrFail(token: string) {
    const refreshTokenRecord = await this.refreshTokenRecordRepository.findOne({ token });

    if (!refreshTokenRecord) {
      throw new UnauthorizedException(getErrorResponse('INVALID_REFRESH_TOKEN'));
    }
    if (new Date() > refreshTokenRecord.expireAt) {
      throw new UnauthorizedException(getErrorResponse('REFRESH_TOKEN_EXPIRED'));
    }

    return refreshTokenRecord;
  }

  async login({ email, password }: Record<'email' | 'password', string>) {
    let user = await this.userRepository.findOne({ email });

    if (!user) {
      // Auto create user for demo use
      const entity = this.userRepository.create({
        email,
        password: await argon2.hash(password, { type: argon2.argon2id }),
      });

      user = await this.userRepository.save(entity);
    } else if (!(await argon2.verify(user.password, password, { type: argon2.argon2id }))) {
      throw new UnauthorizedException(getErrorResponse('INVALID_CREDENTIALS'));
    }

    return this.signTokens(user.id);
  }

  async loginByRefreshToken(token: string) {
    const refreshTokenRecord = await this.findRefreshTokenRecordOrFail(token);

    await this.refreshTokenRecordRepository.softDelete(token);

    return this.signTokens(refreshTokenRecord.userId);
  }

  async logout(refreshToken: string) {
    await this.findRefreshTokenRecordOrFail(refreshToken);
    await this.refreshTokenRecordRepository.softDelete(refreshToken);
  }

  signAccessToken(userId: string) {
    return {
      token: this.jwtService.sign({ userId }, { expiresIn: `${ACCESS_TOKEN_EXPIRES_IN}ms` }),
      expireAt: dayjs().add(ACCESS_TOKEN_EXPIRES_IN).toISOString(),
    };
  }

  async signTokens(userId: string) {
    const { token: accessToken, expireAt: accessTokenExpireAt } = this.signAccessToken(userId);
    const { token: refreshToken, expireAt: refreshTokenExpireAt } = await this.signRefreshToken(userId);

    return {
      accessToken,
      accessTokenExpireAt,
      refreshToken,
      refreshTokenExpireAt,
    };
  }

  async signRefreshToken(userId: string) {
    const tokenRecord = this.refreshTokenRecordRepository.create({
      userId,
      token: randomBytes(16).toString('hex'),
      expireAt: dayjs().add(REFRESH_TOKEN_EXPIRES_IN).toDate(),
    });

    await this.refreshTokenRecordRepository.save(tokenRecord);

    return { token: tokenRecord.token, expireAt: tokenRecord.expireAt.toISOString() };
  }
}
