import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createUser(userDto: UserDto) {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username: username });
  }

  async updateUserInfo(id: number, userDto: UserDto) {
    return await this.userRepository.update(id, userDto);
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }
}
