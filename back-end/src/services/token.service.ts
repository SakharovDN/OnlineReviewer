import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/models/token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  async GenerateAccessToken(payload: any): Promise<string> {
    const token = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: ' process.env.ACCESS_TOKEN_SECRET',
    });

    return token;
  }

  async GenerateRefreshToken(payload: any): Promise<string> {
    const token = this.jwtService.sign(payload, {
      expiresIn: '120d',
      secret: 'process.env.REFRESH_TOKEN_SECRET',
    });

    await this.tokenRepository.save({ userId: payload.id, token });
    return token;
  }

  async DestroyToken(userId: string, token: string) {
    this.tokenRepository.delete({ userId, token });
  }

  async DestroyAllTokens(userId: string) {
    this.tokenRepository.delete({ userId });
  }

  async VerifyAccessToken(request): Promise<boolean> {
    try {
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer != 'Bearer' || !token) throw new Error();

      const user = this.GetUserByToken(token);
      request.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('You need authorization');
    }
  }

  async VerifyRefreshToken(token: string, request: any): Promise<boolean> {
    try {
      const user = this.jwtService.verify(token, {
        secret: 'process.env.REFRESH_TOKEN_SECRET',
      });
      if (
        await this.tokenRepository.findOne({
          where: { userID: user.id, token },
        })
      ) {
        request.user = user;
        return true;
      }
      throw new Error();
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  GetUserByToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: ' process.env.ACCESS_TOKEN_SECRET',
      });
    } catch {
      throw new Error();
    }
  }
}
