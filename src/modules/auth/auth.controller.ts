import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { UserDto } from '../users/dtos/users.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('signup')
  signUp(@Body() createUserDto: UserDto) {
    this.logger.log('fff');
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Get('logout')
  logout(@Req() request: Request) {
    this.authService.logout(request.user['sub']);
  }
}
