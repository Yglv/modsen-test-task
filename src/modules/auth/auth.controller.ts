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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('signup')
  @ApiResponse({ status: 200, description: 'sign up a user', type: User })
  @ApiBody({
    type: [UserDto],
  })
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
  @ApiResponse({ status: 200, description: 'sign in a user', type: User })
  @ApiBody({
    type: [UserDto],
  })
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
  async refreshTokens(@Req() request: Request): Promise<IAuthInterface> {
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
