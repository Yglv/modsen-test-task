import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../users/dtos/users.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger();
  }

  async signUp(createUserDto: UserDto) {
    this.logger.log(createUserDto);
    const userExists = await this.usersService.findUserByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findUserByUsername(authDto.username);
    if (!user) {
      throw new BadRequestException('User does not exists');
    }
    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User does not exists');
    }
    return this.usersService.updateUserInfo(userId, {
      refreshToken: null,
      email: user.email,
      username: user.username,
      password: user.password,
    });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User does not exists');
    }
    await this.usersService.updateUserInfo(userId, {
      refreshToken: hashedRefreshToken,
      email: user.email,
      username: user.username,
      password: user.password,
    });
  }
}