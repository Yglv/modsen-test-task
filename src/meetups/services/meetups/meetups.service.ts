import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Meetup } from 'src/typeorm/meetup.entity';
import { MeetupDto } from 'src/meetups/dtos/meetups.dto';

@Injectable()
export class MeetupsService {
  constructor(
    @InjectRepository(Meetup)
    private readonly meetupRepository: Repository<Meetup>,
  ) {}

  createMeetup(meetupDto: MeetupDto) {
    const newMeetup = this.meetupRepository.create(meetupDto);
    return this.meetupRepository.save(newMeetup);
  }

  findMeetups() {
    return this.meetupRepository.find();
  }

  findMeetupById(id: number) {
    return this.meetupRepository.findOneBy({ id: id });
  }

  changeMeetup(id: number) {
    
  }

  deleteMeetup(id: number) {

  }
}
