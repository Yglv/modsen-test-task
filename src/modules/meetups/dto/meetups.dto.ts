/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MeetupDto {
  @ApiProperty()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    required: false
  })
  description: string;

  @ApiProperty({
    required: false
  })
  keywords: string;

  @ApiProperty()
  @IsNotEmpty()
  time: Date;

  @ApiProperty()
  @IsNotEmpty()
  place: string;
}
