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
  Logger
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeetupDto } from 'src/meetups/dtos/meetups.dto';
import { MeetupsService } from 'src/meetups/services/meetups/meetups.service';
import { Meetup } from 'src/typeorm/meetup.entity';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupsController {
  logger: Logger;
  constructor(private readonly meetupsService: MeetupsService) {
    this.logger = new Logger();
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @ApiResponse({ status: 200, description: 'create a meetup', type: Meetup })
  @ApiBody({
    type: [MeetupDto],
  })
  create(@Body() createMeetupDto: MeetupDto) {
    try {
      const meetup = this.meetupsService.createMeetup(createMeetupDto);
      this.logger.log(meetup);
      return meetup;
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'get a meetup by id', type: Meetup })
  @ApiResponse({ status: 400, description: 'not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const meetup = await this.meetupsService.findMeetupById(id);
      this.logger.log(meetup);
      if (!meetup) {
        throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
      }
      return meetup;
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'get all meetups', type: [Meetup] })
  @ApiResponse({ status: 400, description: 'not found' })
  async findAll() {
    try {
      const meetups = await this.meetupsService.findAllMeetups();
      this.logger.log(meetups);
      if (!meetups) {
        throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
      }
      return meetups;
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'update a meetup', type: Meetup })
  @ApiResponse({ status: 400, description: 'not found' })
  @ApiBody({
    type: [MeetupDto],
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetupDto: MeetupDto,
  ) {
    try {
      const meetup = await this.meetupsService.findMeetupById(id);
      this.logger.log(meetup);
      if (!meetup) {
        throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
      }
      return this.meetupsService.changeMeetup(id, updateMeetupDto);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const meetup = await this.meetupsService.findMeetupById(id);
      if (!meetup) {
        throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
      }
      this.meetupsService.deleteMeetup(id);
      return meetup;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
