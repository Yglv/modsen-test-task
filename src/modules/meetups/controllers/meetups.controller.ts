import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeetupDto } from 'src/modules/meetups/dtos/meetups.dto';
import { MeetupsService } from 'src/modules/meetups/services/meetups.service';
import { Meetup } from 'src/modules/meetups/entities/meetup.entity';
import { Request } from 'express';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupsController {
  logger: Logger;
  constructor(private readonly meetupsService: MeetupsService) {
    this.logger = new Logger();
  }

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'create a meetup', type: Meetup })
  @ApiBody({
    type: [MeetupDto],
  })
  create(@Body() createMeetupDto: MeetupDto) {
    const meetup = this.meetupsService.createMeetup(createMeetupDto);
    this.logger.log(meetup);
    return meetup;
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'get a meetup by id', type: Meetup })
  @ApiResponse({ status: 400, description: 'not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const meetup = await this.meetupsService.findMeetupById(id);
    this.logger.log(meetup);
    if (!meetup) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return meetup;
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'get all meetups', type: [Meetup] })
  @ApiResponse({ status: 400, description: 'not found' })
  async findAll(@Req() request: Request) {
    const sortParam = request.query.sort;
    const sortTypeParam = request.query.type;
    const searchParam = request.query.search;
    const page: number = parseInt(request.query.page as string) || 1;
  
    if (searchParam) {
      return await this.meetupsService.findMeetupsBySearch(searchParam);
    }
    if (sortParam) {
      return await this.meetupsService.findMeetupsBySort(
        (sortParam as string).toUpperCase(),
        sortTypeParam,
      );
    }
    if (page) {
      return await this.meetupsService.findMeetupsByPage(page);
    }

    const meetups = await this.meetupsService.findAllMeetups();
    this.logger.log(meetups);
    if (!meetups) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return meetups;
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'update a meetup', type: Meetup })
  @ApiResponse({ status: 400, description: 'not found' })
  @ApiBody({
    type: [MeetupDto],
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetupDto: MeetupDto,
  ) {
    const meetup = await this.meetupsService.findMeetupById(id);
    this.logger.log(meetup);
    if (!meetup) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return this.meetupsService.changeMeetup(id, updateMeetupDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const meetup = await this.meetupsService.findMeetupById(id);
    if (!meetup) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    this.meetupsService.deleteMeetup(id);
    return meetup;
  }
}