import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddWordRequest {
  @IsNotEmpty()
  @IsString()
  readonly value: string;

  @IsNotEmpty()
  @IsString()
  // установить максимальную длину комментария в конфиге
  readonly comment: string;
}

export class EditWordRequest extends AddWordRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class DeleteWordRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
