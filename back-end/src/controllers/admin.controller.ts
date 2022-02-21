import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BanUserRequest,
  DeleteUserRequest,
  UnbanUserRequest,
} from 'src/dto/requests/ManageUsersRequest.dto';
import {
  AddWordRequest,
  DeleteWordRequest,
  EditWordRequest,
} from 'src/dto/requests/ManageDictionaryRequest.dto';
import { AdminAccessTokenGuard } from 'src/guards/auth.guard';
import { AdminService } from 'src/services/admin.service';
import { DictionaryService } from 'src/services/dictionary.service';
import { GetStatisticsRequest } from 'src/dto/requests/GetStatisticsRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from 'src/models/word.model';
import { Repository } from 'typeorm';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private dictionaryService: DictionaryService,
    @InjectRepository(Word) private wordRepository: Repository<Word>,
  ) {}

  @UseGuards(AdminAccessTokenGuard)
  @Get('words')
  GetWords() {
    return this.dictionaryService.GetWords(null, this.wordRepository);
  }

  @UseGuards(AdminAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Post('words')
  AddWord(@Body() dto: AddWordRequest) {
    return this.dictionaryService.AddWord(dto, this.wordRepository, null);
  }

  @UseGuards(AdminAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Patch('words')
  EditWord(@Body() dto: EditWordRequest) {
    return this.dictionaryService.EditWord(dto, this.wordRepository);
  }

  @UseGuards(AdminAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Delete('words')
  DeleteWord(@Body() dto: DeleteWordRequest) {
    return this.dictionaryService.DeleteWord(dto.id, this.wordRepository);
  }

  @UseGuards(AdminAccessTokenGuard)
  @Get('users')
  GetUsers() {
    return this.adminService.GetUsers();
  }

  @UseGuards(AdminAccessTokenGuard)
  @Delete('users')
  DeleteUser(@Body() dto: DeleteUserRequest) {
    return this.adminService.DeleteUser(dto.id);
  }

  @UseGuards(AdminAccessTokenGuard)
  @Patch('ban')
  BanUser(@Body() dto: BanUserRequest) {
    return this.adminService.BanUser(dto.id);
  }

  @UseGuards(AdminAccessTokenGuard)
  @Patch('unban')
  UnbanUser(@Body() dto: UnbanUserRequest) {
    return this.adminService.UnbanUser(dto.id);
  }

  @UseGuards(AdminAccessTokenGuard)
  @Get('statistics')
  GetStatistics(@Body() dto: GetStatisticsRequest) {
    return this.adminService.GetStatistics(dto);
  }
}
