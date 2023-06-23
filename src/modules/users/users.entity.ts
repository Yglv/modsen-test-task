/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Factory } from 'nestjs-seeder';
import { Role } from 'src/common/enums/role.enum';
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
    nullable:true,
  })
  refreshToken: string;

  @ApiProperty()
  @Column({
    name:'user_role',
    type: 'character varying',
    default: 'user'
  })
  role: Role
}
