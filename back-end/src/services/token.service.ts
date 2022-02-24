import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/models/token.model';
import { UserRole } from 'src/models/user.model';

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
    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedException('You need authorization');

    const user = this.GetUserByAccessToken(token);
    request.user = user;
    return true;
  }

  async VerifyAdminAccessToken(request): Promise<boolean> {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('You need authorization');
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedException('You need authorization');

    const user = this.GetUserByAccessToken(token);
    if (user.role != UserRole.ADMIN) {
      throw new ForbiddenException('not admin');
    }
    request.user = user;
    return true;
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

  GetUserByAccessToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: ' process.env.ACCESS_TOKEN_SECRET',
      });
    } catch {
      throw new UnauthorizedException('You need authorization');
    }
  }
}
