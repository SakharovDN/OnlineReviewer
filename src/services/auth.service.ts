import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/models/user.model";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { MailService } from "./mail.service";
import { CreateOrLoginUserDto } from "src/dto/CreateOrLoginUserDto.dto";
import { TokenService } from "./token.service";


@Injectable()
export class AuthService {
    constructor(
        // @InjectRepository(ResetPasswordSession) private resetSessionRepository: Repository<ResetPasswordSession>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private tokenService: TokenService,
        private mailService: MailService
    ) {}

    private async IsEmailExists(email: string): Promise<boolean> {
        return await this.userRepository.findOne({ email }) ? true : false;
    }

    async ConfirmEmail(id: string, res) {
        await this.userRepository.update(id, { verified: true });
        return res.redirect('http://ya.ru');
    }

    async CreateUser(dto): Promise<any> {
        if(await this.IsEmailExists(dto.email))
            throw new ConflictException("This email is already in use");
                
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(dto.password, salt);
        let user = await this.userRepository.save({ ...dto, password: hashedPassword });

        const activateLink = `http://localhost:3000/auth/activate/${user.id}`;
        this.mailService.sendVerifyEmail(user.email, activateLink);
        return;
    }

    async Login(dto: CreateOrLoginUserDto, response): Promise<any> {
        let user = await this.userRepository.findOne({ where: { email: dto.email }});
        if(!user || !bcrypt.compareSync(dto.password, user.password))
            throw new NotFoundException("Incorrect login or password");
        if(!user.verified)
            throw new ForbiddenException("Account is not verified");

        user = { ...user };
        delete user.password;
        delete user.verified;
        const payload = {
            id: user.id,
            email: user.email
        };
        const RefreshToken = await this.tokenService.GenerateRefreshToken(payload);
        const AccessToken = await this.tokenService.GenerateAccessToken(payload);
        response.cookie("RefreshToken", RefreshToken, { httpOnly: true });
        return {
            AccessToken: AccessToken,
            user: payload
        };
    }
    
    // async UpdateAccessToken(user): Promise<ResponseUpdateToken> {
    //     const payload = {
    //         id: user.id,
    //         email: user.email,
    //     };
        
    //     return { AccessToken: await this.tokenService.GenerateAccessToken(payload) };
    // }

    async Logout(request) {
        this.tokenService.DestroyToken(request.user.id, request.cookies.RefreshToken);
    }

    // async ResetPassword(dto: ResetPasswordDto) {
    //     const { id, email, verified } = { ...await this.userRepository.findOne({ email: dto.email }) };
    //     if(!id)
    //         throw new NotFoundException("User not found");
    //     if(!verified)
    //         throw new NotFoundException("User not verified");

    //     const date = new Date();
    //     date.setDate(date.getDate() + 1);
    //     const { sessionID } = await this.resetSessionRepository.save({ userID: id, expire_in: date, redirect_to: "#" });

    //     const activateLink = `${process.env.SERVER_URL}/auth/disactivate/${sessionID}`;
    //     this.mailService.sendResetEmail(email, activateLink);
    // }

    // async ConfirmReset(sessionID: string, res) {
    //     const session = { ...await this.resetSessionRepository.findOne(sessionID) };

    //     if(Object.keys(session).length === 0 || new Date() >= session.expire_in)
    //         throw new NotFoundException("Password reset-session not found or expired");

    //     this.userRepository.update(session.userID, { verified: false });
    //     this.tokenService.DestroyAllTokens(session.userID);

    //     return res.redirect(process.env.CLIENT_URL);
    // }

    // async RestorePassword(sessionID: string, dto: RestorePasswordDto) {
    //     const { userID } = { ...await this.resetSessionRepository.findOne(sessionID) };
    //     if(!userID)
    //         throw new NotFoundException("Password reset-session not found");
        
    //     const salt = bcrypt.genSaltSync();
    //     const hashedPassword = bcrypt.hashSync(dto.password, salt);
    //     await this.userRepository.update(userID, { password: hashedPassword, verified: true });
    //     await this.resetSessionRepository.delete(sessionID);
    // }
        
}