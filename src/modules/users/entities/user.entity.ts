/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Factory } from 'nestjs-seeder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @ApiProperty()
  @Column({
    name: 'user_email',
    type: 'character varying',
    nullable: false,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    name: 'user_name',
    type: 'character varying',
    nullable: false,
    unique: true,
  })
  username: string;

  @ApiProperty()
  @Column({
    name: 'user_password',
    type: 'character varying',
    nullable: false,
  })
  password: string;

  @ApiProperty()
  @Column({
    name: 'user_refresh_token',
    type: 'character varying',
  })
  refreshToken: string;
}
