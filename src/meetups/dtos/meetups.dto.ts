import { IsNotEmpty } from 'class-validator';

export class MeetupDto {
  @IsNotEmpty()
  topic: string;

  description: string;

  keywords: string;

  @IsNotEmpty()
  time: Date;

  @IsNotEmpty()
  place: string;
}
