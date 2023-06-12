import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meetup {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'meetup_id',
  })
  id: number;

  @Column({
    name: 'meetup_topic',
    nullable: false,
    default: '',
  })
  topic: string;

  @Column({
    name: 'meetup_description',
    nullable: true,
    default: '',
  })
  description: string;

  @Column({
    name: 'meetup_keywords',
    nullable: true,
    default: '',
  })
  keywords: string;

  
  @Column({
    name: 'meetup_time',
    nullable: true,
    default: '', 
  })
  time: Date;

  @Column({
    name: 'meetup_place',
    nullable: false,
    default: '',
  })
  place: string;
}
