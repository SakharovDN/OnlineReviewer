import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';
import { ResetPasswordSession } from 'src/models/reset-session.model';
import { Token } from 'src/models/token.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { MailModule } from './mail.module';
import { TokenModule } from './token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User, Token, ResetPasswordSession]),
    MailModule,
    TokenModule
  ]
})
export class AuthModule {}
