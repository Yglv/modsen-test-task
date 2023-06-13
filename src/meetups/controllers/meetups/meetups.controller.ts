import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete
} from '@nestjs/common';
import { MeetupDto } from 'src/meetups/dtos/meetups.dto';
import { MeetupsService } from 'src/meetups/services/meetups/meetups.service';

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @Post()
  create(@Body() createMeetupDto: MeetupDto) {
    return this.meetupsService.createMeetup()
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param(':id') id: number) {}

  @Patch(':id')
  update(@Param(':id') id: number, @Body() updateMeetupDto: MeetupDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: number) {}
}

