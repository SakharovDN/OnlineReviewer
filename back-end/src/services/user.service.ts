import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnWord } from 'src/models/own-word.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UpdatePasswordDto } from 'src/dto/requests/UpdatePasswordRequest.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OwnWord) private wordRepository: Repository<OwnWord>,
    private tokenService: TokenService,
  ) {}

  async GetWords(user) {
    return await this.wordRepository.find({ user });
  }

  async AddWord(dto, user): Promise<any> {
    const { value, comment } = dto;
    try {
      await this.wordRepository.save({ value, comment, user });
    } catch (ex) {
      if (ex.constraint == 'WordExistsException')
        throw new ConflictException('This word is already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async EditWord(dto): Promise<any> {
    const { id, value, comment } = dto;
    try {
      await this.wordRepository.update(id, { value, comment });
    } catch (ex) {
      if (ex.constraint == 'WordExistsException')
        throw new ConflictException('This word is already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async DeleteWord(id) {
    this.wordRepository.delete(id);
  }

  async UpdatePassword(dto: UpdatePasswordDto, id: string) {
    const { password } = await this.userRepository.findOne({ where: { id } });
    if (!bcrypt.compareSync(dto.currentPassword, password))
      throw new BadRequestException('Current password is incorrect');

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(dto.newPassword, salt);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async DeleteUser(id: string) {
    this.userRepository.delete({ id });
    this.tokenService.DestroyAllTokens(id);
  }
}
