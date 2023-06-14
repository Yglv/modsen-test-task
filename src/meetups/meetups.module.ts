import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meetup } from 'src/typeorm/meetup.entity';
import { MeetupsController } from './controllers/meetups/meetups.controller';
import { MeetupsService } from './services/meetups/meetups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meetup])],
  controllers: [MeetupsController],
  providers: [MeetupsService]
})
export class MeetupsModule {}
