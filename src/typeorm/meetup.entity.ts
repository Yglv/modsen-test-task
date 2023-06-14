import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meetup {
  @PrimaryGeneratedColumn({
    type: 'bigint', 
    name: 'meetup_id',
  })
  id: number;

  @Column({
    name: 'meetup_topic',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  topic: string;

  @Column({
    name: 'meetup_description',
    type: 'character varying',
    nullable: true,
    default: '',
  })
  description: string;

  @Column({
    name: 'meetup_keywords',
    type: 'character varying',
    nullable: true,
    default: '',
  })
  keywords: string;

  @Column({
    name: 'meetup_time',
    type: 'date',
    nullable: false,
  })
  time: Date;

  @Column({
    name: 'meetup_place',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  place: string;
}
