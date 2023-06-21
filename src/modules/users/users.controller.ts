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
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  logger: Logger;
  constructor(private readonly usersService: UsersService) {
    this.logger = new Logger();
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async create(@Body() createUserDto: UserDto) {
    const user = await this.usersService.createUser(createUserDto);
    this.logger.log(user);
    return user;
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async findAll() {
    const users = await this.usersService.findAllUsers();
    this.logger.log(users);
    if (!users) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return users;
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Get(':name')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async findByUsername(@Param('name') username: string) {
    const user = await this.usersService.findUserByUsername(username);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UserDto,
  ) {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateUserInfo(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.deleteUser(id);
  }
}
