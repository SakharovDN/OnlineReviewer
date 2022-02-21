import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UpdatePasswordDto } from 'src/dto/requests/UpdatePasswordRequest.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private tokenService: TokenService,
  ) {}

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
