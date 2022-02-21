import { Module } from '@nestjs/common';
import { TokenModule } from './token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { OwnWord } from 'src/models/own-word.model';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { DictionaryService } from 'src/services/dictionary.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DictionaryService],
  imports: [
    TypeOrmModule.forFeature([User, OwnWord]),
    TokenModule,
  ]
})
export class UserModule {}
