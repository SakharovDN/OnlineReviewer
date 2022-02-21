import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Between, Repository } from 'typeorm';
import { TokenService } from './token.service';
import { ReviewEvent } from 'src/models/review-event.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ReviewEvent)
    private reviewEventRepository: Repository<ReviewEvent>,
    private tokenService: TokenService,
  ) {}

  async GetUsers() {
    return await this.userRepository.find();
  }

  async BanUser(id: string) {
    await this.userRepository.update(id, { banned: true });
  }

  async UnbanUser(id: string) {
    await this.userRepository.update(id, { banned: false });
  }

  async DeleteUser(id: string) {
    this.userRepository.delete({ id });
    this.tokenService.DestroyAllTokens(id);
  }

  async GetStatistics(dto) {
    const { from, to } = dto;
    let events = await this.reviewEventRepository.find({
      where: {
        timestamp: Between(from, to),
      },
    });
    return {
      events: events,
      eventsAmount: events.length,
    };
  }
}
