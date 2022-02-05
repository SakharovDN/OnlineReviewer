import { Module } from '@nestjs/common';
import { HomeController } from 'src/controllers/home.controller';
import { ReviewService } from 'src/services/review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { TokenModule } from './token.module';

@Module({
  controllers: [HomeController],
  providers: [ReviewService],
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule
  ],
})
export class HomeModule {}
