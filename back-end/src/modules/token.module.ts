import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/services/token.service';
import { Token } from 'src/models/token.model';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [TypeOrmModule.forFeature([Token]), JwtModule.register({})],
})
export class TokenModule {}
