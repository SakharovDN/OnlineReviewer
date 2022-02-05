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
import {
  AddWordRequest,
  DeleteWordRequest,
  EditWordRequest,
} from 'src/dto/requests/ManageDictionaryRequest.dto';
import { UpdatePasswordDto } from 'src/dto/requests/UpdatePasswordRequest.dto';
import { AuthAccessTokenGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('words')
  GetWords(@Req() { user }) {
    return this.userService.GetWords(user.id);
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Post('words')
  AddWord(@Req() { user }, @Body() dto: AddWordRequest) {
    return this.userService.AddWord(dto, user.id);
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Patch('words')
  EditWord(@Body() dto: EditWordRequest) {
    return this.userService.EditWord(dto);
  }

  @UseGuards(AuthAccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Delete('words')
  DeleteWord(@Body() dto: DeleteWordRequest) {
    return this.userService.DeleteWord(dto.id);
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
