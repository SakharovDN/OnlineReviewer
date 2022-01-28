import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendVerifyEmail(to: string, link: string) {
        try {
            return await this.mailerService.sendMail({
                to,
                subject: "Подтверждение почты",
                html:`
                    <h2>Для продолжения работы с приложением пройдите по ссылке и подтвердите вашу почту</h2>
                    <a href='${link}'>Подтвердить почту</a>
                `
            });
        }
        catch(ex) {
            console.log(ex.message)
        }
    }

    async sendResetEmail(to: string, link: string) {
        try {
            return await this.mailerService.sendMail({
                to,
                subject: "Сброс пароля",
                html:`
                    <h2>Для смены пароля перейдите по ссылке</h2>
                    <a href='${link}'>Сменить пароль</a>
                `
            });
        }
        catch(ex) {
            console.log(ex.message)
        }
    }

}