/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Factory } from 'nestjs-seeder';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Meetup {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'meetup_id',
  })
  id: number;

  @Factory(faker => faker.lorem.words(2))
  @ApiProperty()
  @Column({
    name: 'meetup_topic',
    type: 'character varying',
    nullable: false,
  })
  topic: string;

  @Factory(faker => faker.lorem.words(10))
  @ApiProperty()
  @Column({
    name: 'meetup_description',
    type: 'character varying',
    nullable: true,
  })
  description: string;

  @Factory(faker => faker.lorem.words(3))
  @ApiProperty()
  @Column({
    name: 'meetup_keywords',
    type: 'character varying',
    nullable: true,
  })
  keywords: string;

  @ApiProperty()
  @Column({
    name: 'meetup_time',
    type: "timestamp with time zone",
    nullable: false,
    default: new Date()
  })
  time: Date;

  @Factory(faker => faker.lorem.word(5))
  @ApiProperty()
  @Column({
    name: 'meetup_place',
    type: 'character varying',
    nullable: false,
  })
  place: string;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn()
  admin: User

  @ApiProperty()
  @ManyToMany(() => User)
  @JoinTable()
  users: User[]
}
