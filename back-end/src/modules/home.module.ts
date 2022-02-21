import { Module } from '@nestjs/common';
import { HomeController } from 'src/controllers/home.controller';
import { ReviewService } from 'src/services/review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token.module';
import { ReviewEvent } from 'src/models/review-event.model';

@Module({
  controllers: [HomeController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([ReviewEvent]), TokenModule],
})
export class HomeModule {}
