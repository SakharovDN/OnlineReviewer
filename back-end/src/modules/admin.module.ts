import { Module } from '@nestjs/common';
import { TokenModule } from './token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { AdminController } from 'src/controllers/admin.controller';
import { DictionaryService } from 'src/services/dictionary.service';
import { AdminService } from 'src/services/admin.service';
import { Word } from 'src/models/word.model';
import { ReviewEvent } from 'src/models/review-event.model';

@Module({
  controllers: [AdminController],
  providers: [DictionaryService, AdminService],
  imports: [TypeOrmModule.forFeature([User, Word, ReviewEvent]), TokenModule],
})
export class AdminModule {}
