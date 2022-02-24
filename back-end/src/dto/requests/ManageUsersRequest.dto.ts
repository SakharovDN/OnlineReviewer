import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: string;
}

export class BanUserRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: string;
}

export class UnbanUserRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: string;
}
