import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrLoginUserRequest } from 'src/dto/requests/CreateOrLoginUserRequest.dto';
import { ResetPasswordRequest } from 'src/dto/requests/ResetPasswordRequest.dto';
import { RestorePasswordRequest } from 'src/dto/requests/RestorePasswordRequest.dto';
import {
  AuthAccessTokenGuard,
  AuthRefreshTokenGuard,
} from 'src/guards/auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('registration')
  CreateUser(@Body() dto: CreateOrLoginUserRequest) {
    return this.authService.CreateUser(dto);
  }

  @Get('activate/:id')
  ConfirmEmail(@Param('id') id: string, @Res() res) {
    return this.authService.ConfirmEmail(id, res);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Post('login')
  Login(
    @Body() dto: CreateOrLoginUserRequest,
    @Res({ passthrough: true }) res,
  ) {
    return this.authService.Login(dto, res);
  }

  @UseGuards(AuthRefreshTokenGuard)
  @HttpCode(200)
  @Put('updatetoken')
  UpdateToken(@Req() { user }) {
    return this.authService.UpdateAccessToken(user);
  }

  @UseGuards(AuthAccessTokenGuard)
  @HttpCode(204)
  @Delete('logout')
  Logout(@Req() req, @Res() res) {
    this.authService.Logout(req);
    res.clearCookie('RefreshToken');
    return res.send();
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Post('reset-password')
  Reset(@Body() dto: ResetPasswordRequest) {
    return this.authService.ResetPassword(dto);
  }

  @Get('disactivate/:id')
  ConfirmReset(@Param('id') sessionID: string, @Res() res) {
    return this.authService.ConfirmReset(sessionID, res);
  }

  @UsePipes(ValidationPipe)
  @Post('restore-password/:id')
  Resrore(@Param('id') sessionID: string, @Body() dto: RestorePasswordRequest) {
    return this.authService.RestorePassword(sessionID, dto);
  }
}
