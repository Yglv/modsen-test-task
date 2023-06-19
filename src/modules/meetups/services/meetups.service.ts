import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Meetup } from 'src/modules/meetups/entities/meetup.entity';
import { MeetupDto } from 'src/modules/meetups/dtos/meetups.dto';

@Injectable()
export class MeetupsService {
  logger: Logger;
  constructor(
    @InjectRepository(Meetup)
    private readonly meetupRepository: Repository<Meetup>,
  ) {
    this.logger = new Logger();
  }

  async createMeetup(meetupDto: MeetupDto): Promise<Meetup> {
    const newMeetup = this.meetupRepository.create(meetupDto);
    return await this.meetupRepository.save(newMeetup);
  }

  async findAllMeetups(): Promise<Meetup[]> {
    return await this.meetupRepository.find();
  }

  async findMeetupsBySearch(searchParam): Promise<Meetup[]> {
    const builder = this.meetupRepository.createQueryBuilder('meetups');
    const meetups = await builder
      .where('meetups.topic LIKE :s', {
        s: `%${searchParam}%`,
      })
      .getMany();
    this.logger.log(meetups);
    return meetups;
  }

  async findMeetupsBySort(sortParam, sortTypeParam): Promise<Meetup[]> {
    const builder = this.meetupRepository.createQueryBuilder('meetups');
    let meetups: Promise<Meetup[]>;
    switch (sortTypeParam) {
      case 'topic':
        meetups = builder.orderBy('meetups.topic', sortParam).getMany();
        this.logger.log(meetups);
        break;
      case 'time':
        meetups = builder.orderBy('meetups.time', sortParam).getMany();
        this.logger.log(meetups);
        break;
      case 'place':
        meetups = builder.orderBy('meetups.place', sortParam).getMany();
        this.logger.log(meetups);
        break;
    }
    return meetups;
  }

  async findMeetupsByPage(pageNum) {
    const builder = this.meetupRepository.createQueryBuilder('meetups');
    const perPage = 20;
    const totalCountOfMeetups = await builder.getCount();

    builder.offset((pageNum - 1) * perPage).limit(perPage);
    return {
      data: await builder.getMany(),
      totalCountOfMeetups,
      pageNum,
      last_page: Math.ceil(totalCountOfMeetups / perPage),
    };
  }

  async findMeetupById(id: number): Promise<Meetup> {
    return await this.meetupRepository.findOneBy({ id: id });
  }

  async changeMeetup(id: number, meetupDto: MeetupDto): Promise<UpdateResult> {
    return await this.meetupRepository.update(id, meetupDto);
  }

  async deleteMeetup(id: number): Promise<DeleteResult> {
    return await this.meetupRepository.delete(id);
  }
}
