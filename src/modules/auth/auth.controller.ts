import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from '../users/dto/users.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { IAuthInterface } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('signup')
  async signUp(
    @Body() createUserDto: UserDto,
    @Req() request: Request,
  ): Promise<IAuthInterface> {
    const tokens = await this.authService.signUp(createUserDto);
    request.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return tokens;
  }

  @Post('signin')
  async signIn(
    @Body() authDto: AuthDto,
    @Req() request: Request,
  ): Promise<IAuthInterface> {
    const tokens = await this.authService.signIn(authDto);
    request.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return tokens;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() request: Request) {
    const userId = request.user['sub'];
    const refreshToken = request.user['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    request.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return tokens;
  }

  logout(@Req() request: Request): void {
    this.authService.logout(request.user['sub']);
  }
}
