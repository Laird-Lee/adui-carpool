import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  account: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
