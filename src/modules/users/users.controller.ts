import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Meetup } from '../meetups/meetups.entity';
import { UserDto } from './dto/users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
//@UseGuards(AccessTokenGuard)
export class UsersController {
  logger: Logger;
  constructor(private readonly usersService: UsersService) {
    this.logger = new Logger();
  }

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'create a user', type: User })
  @ApiBody({
    type: [UserDto],
  })
  async create(@Body() createUserDto: UserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);
    this.logger.log(user);
    return user;
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'get all users', type: [User] })
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAllUsers();
    this.logger.log(users);
    if (!users) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return users;
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'get a user by id', type: User })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Get(':name')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'get a user by username',
    type: User,
  })
  async findByUsername(@Param('name') username: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'update a user', type: User })
  @ApiBody({
    type: [UserDto],
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UserDto,
  ): Promise<UpdateResult> {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateUserInfo(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'delete a user', type: User })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.deleteUser(id);
  }
}
