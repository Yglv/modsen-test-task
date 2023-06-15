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
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MeetupDto } from 'src/meetups/dtos/meetups.dto';
import { MeetupsService } from 'src/meetups/services/meetups/meetups.service';

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createMeetupDto: MeetupDto) {
    try {
      return this.meetupsService.createMeetup(createMeetupDto);
    } catch (err) {
      console.error(err);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const meetup = await this.meetupsService.findMeetupById(id);
    console.log(meetup)
    if (!meetup) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return meetup;
  }

  @Get()
  async findAll() {
    const meetups = await this.meetupsService.findAllMeetups();
    if (!meetups) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return meetups;
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetupDto: MeetupDto,
  ) {
    try {
      return this.meetupsService.changeMeetup(id, updateMeetupDto);
    } catch (err) {
      console.error(err)
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.meetupsService.deleteMeetup(id);
    } catch (err) {
      console.error(err);
    }
  }
}
