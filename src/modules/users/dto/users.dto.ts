/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  /*@ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()*/
  email: string;

  /*@ApiProperty()
  @IsString()
  @IsNotEmpty()*/
  username: string;

  /*@ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)*/
  password: string;

  /*@ApiProperty()
  @IsString()*/
  refreshToken?: string;
}
