import { IsDate, IsNotEmpty } from 'class-validator';

export class GetStatisticsRequest {
  @IsNotEmpty()
  @IsDate()
  readonly from: Date;

  @IsNotEmpty()
  @IsDate()
  readonly to: Date;
}
