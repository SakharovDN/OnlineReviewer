import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from 'src/services/mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: true,
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: 'deafsah@gmail.com',
          refreshToken:
            '1//04bIu6ir3OuwZCgYIARAAGAQSNwF-L9IrLyxENmpSBGpyNqtkBGbapEM4AUJzjkEJGPtT9yyoIFDnOqcljThQpOLkk4P5rXqz_20',
          clientId:
            '590246196387-bu6egnqcv2fvhg3lju4du4shvac07hdj.apps.googleusercontent.com',
          clientSecret: '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',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@examle.com>',
      },
    }),
  ],
})
export class MailModule {}
