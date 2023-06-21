/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Meetup } from '../meetups.entity';
import { Repository } from 'typeorm';

export class MeetupSeeder implements Seeder {
  constructor(
    @InjectRepository(Meetup)
    private readonly meetupRepository: Repository<Meetup>,
  ) {}

  seed(): Promise<any> {
    const meetups = DataFactory.createForClass(Meetup).generate(50);
    return this.meetupRepository.insert(meetups);
  }

  drop(): Promise<any> {
    return this.meetupRepository.delete({});
  }
}
