import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/users.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  logger: Logger;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.logger = new Logger();
  }

  async createUser(userDto: UserDto): Promise<User> {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username: username });
  }

  async updateUserInfo(id: number, userDto: UserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, userDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
