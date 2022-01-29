import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
