/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meetup {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'meetup_id',
  })
  id: number;

  @ApiProperty()
  @Column({
    name: 'meetup_topic',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  topic: string;

  @ApiProperty()
  @Column({
    name: 'meetup_description',
    type: 'character varying',
    nullable: true,
    default: '',
  })
  description: string;

  @ApiProperty()
  @Column({
    name: 'meetup_keywords',
    type: 'character varying',
    nullable: true,
    default: '',
  })
  keywords: string;

  @ApiProperty()
  @Column({
    name: 'meetup_time',
    type: "timestamp with time zone",
    nullable: false,
  })
  time: Date;

  @ApiProperty()
  @Column({
    name: 'meetup_place',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  place: string;
}
