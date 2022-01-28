import { Body, Controller, Delete, Get, HttpCode, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateOrLoginUserDto } from "src/dto/CreateOrLoginUserDto.dto";
import { AuthService } from "src/services/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UsePipes(ValidationPipe)
    @Post('registration')
    CreateUser(@Body() dto: CreateOrLoginUserDto) {
        return this.authService.CreateUser(dto);
    }
    
    @Get('activate/:id')
    ConfirmEmail(@Param('id') id: string, @Res() res) {
        return this.authService.ConfirmEmail(id, res);
    }

    @UsePipes(ValidationPipe)
    @HttpCode(200)
    @Post('login')
    Login(@Body() dto: CreateOrLoginUserDto, @Res({ passthrough: true }) res) {
        return this.authService.Login(dto, res);
    } 
        
    // @UseGuards(AuthRefreshTokenGuard)
    // @HttpCode(200)
    // @Put('updatetoken')
    // UpdateToken(@Req() { user }) {
    //     return this.authService.UpdateAccessToken(user);
    // }

    // @UseGuards(AuthAccessTokenGuard)
    // @HttpCode(204)
    // @Delete('logout')
    // Logout(@Req() req, @Res() res) {
    //     this.authService.Logout(req);
    //     res.clearCookie("RefreshToken");
    //     return res.send();
    // }

    // @UsePipes(ValidationPipe)
    // @HttpCode(200)
    // @Post('reset-password')
    // Reset(@Body() dto: ResetPasswordDto) {
    //     return this.authService.ResetPassword(dto);
    // }

    // @Get('disactivate/:id')
    // ConfirmReset(@Param('id') sessionID: string, @Res() res) {
    //     return this.authService.ConfirmReset(sessionID, res);
    // }
    
    // @UsePipes(ValidationPipe)
    // @Post('restore-password/:id')
    // Resrore(@Param('id') sessionID: string, @Body() dto: RestorePasswordDto) {
    //     return this.authService.RestorePassword(sessionID, dto);
    // }

}