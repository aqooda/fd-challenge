import { IsEmail, IsIn, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

type LoginType = typeof loginTypes[number];

const loginTypes = ['DEFAULT', 'REFRESH_TOKEN'] as const;

export class LoginDto {
  @IsEmail()
  @ValidateIf(({ type }: LoginDto) => type !== 'REFRESH_TOKEN')
  email: string;

  @IsString()
  @Length(8, 16)
  @ValidateIf(({ type }: LoginDto) => type !== 'REFRESH_TOKEN')
  password: string;

  @IsString()
  @Length(32, 32)
  @ValidateIf(({ type }: LoginDto) => type === 'REFRESH_TOKEN')
  refreshToken: string;

  @IsIn(loginTypes)
  @IsOptional()
  type: LoginType;
}
