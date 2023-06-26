import {
  Injectable,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../users/dto/users.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { IAuthInterface } from './interface/auth.interface';
import { UpdateResult } from 'typeorm';
import { User } from '../users/users.entity';

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

  async signUp(createUserDto: UserDto): Promise<IAuthInterface> {
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

  async signIn(authDto: AuthDto): Promise<IAuthInterface> {
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

  async logout(userId: number): Promise<UpdateResult> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User does not exists');
    }
    return this.usersService.updateUserInfo(userId, {
      refreshToken: null,
      email: user.email,
      username: user.username,
      password: user.password,
      //role: user.role,
    });
  }

  async getTokens(userId: number, username: string): Promise<IAuthInterface> {
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

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
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
      //role: user.role,
    });
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<IAuthInterface> {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken) {
      throw new HttpException('User does not exists', HttpStatus.FORBIDDEN);
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new HttpException('Tokens do not match', HttpStatus.FORBIDDEN);
    }
    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async getUserByAccessToken(accessToken: string): Promise<User> {
    const decoded = this.jwtService.decode(accessToken);
    let id = 0;
    if (typeof decoded == 'object') id = decoded.id;
    const user = await this.usersService.findUserById(id);
    this.logger.log(user);
    return user;
  }
}
