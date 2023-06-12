import { Module } from '@nestjs/common';
import { MeetupsController } from './controllers/meetups/meetups.controller';
import { MeetupsService } from './services/meetups/meetups.service';

@Module({
  controllers: [MeetupsController],
  providers: [MeetupsService]
})
export class MeetupsModule {}
