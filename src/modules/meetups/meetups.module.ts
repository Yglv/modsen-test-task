import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meetup } from 'src/modules/meetups/meetups.entity';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meetup])],
  controllers: [MeetupsController],
  providers: [MeetupsService]
})
export class MeetupsModule {}
