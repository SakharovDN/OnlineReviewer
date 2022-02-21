import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddWordRequest,
  DeleteWordRequest,
  EditWordRequest,
} from 'src/dto/requests/ManageDictionaryRequest.dto';
import { UpdatePasswordDto } from 'src/dto/requests/UpdatePasswordRequest.dto';
import { AuthAccessTokenGuard } from 'src/guards/auth.guard';
import { OwnWord } from 'src/models/own-word.model';
import { DictionaryService } from 'src/services/dictionary.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private dictionaryService: DictionaryService,
    @InjectRepository(OwnWord) private ownWwordRepository,
  ) {}

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('words')
  GetWords(@Req() { user }) {
    return this.dictionaryService.GetWords(user.id, this.ownWwordRepository);
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Post('words')
  AddWord(@Req() { user }, @Body() dto: AddWordRequest) {
    return this.dictionaryService.AddWord(
      dto,
      this.ownWwordRepository,
      user.id,
    );
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Patch('words')
  EditWord(@Body() dto: EditWordRequest) {
    return this.dictionaryService.EditWord(dto, this.ownWwordRepository);
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Delete('words')
  DeleteWord(@Body() dto: DeleteWordRequest) {
    return this.dictionaryService.DeleteWord(dto.id, this.ownWwordRepository);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthAccessTokenGuard)
  @Patch('change-password')
  UpdatePassword(@Body() dto: UpdatePasswordDto, @Req() { user }) {
    return this.userService.UpdatePassword(dto, user.id);
  }

  @UseGuards(AuthAccessTokenGuard)
  @Delete()
  DeleteUser(@Req() { user }, @Res() res) {
    this.userService.DeleteUser(user.id);
    res.clearCookie('RefreshToken');
    return res.send();
  }
}
