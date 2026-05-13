import { IsString } from 'class-validator';

export class HealthResponse {
  @IsString()
  timestamp!: string;

  @IsString()
  message!: string;
}
