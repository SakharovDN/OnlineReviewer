import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 15)
  @Transform(
    ({ value }: TransformFnParams) =>
      (value = typeof value === 'string' ? value.trim() : value),
  )
  readonly currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 15)
  @Transform(
    ({ value }: TransformFnParams) =>
      (value = typeof value === 'string' ? value.trim() : value),
  )
  readonly newPassword: string;
}
