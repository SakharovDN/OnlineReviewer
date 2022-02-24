import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home.module';
import { UserModule } from './user.module';
import { AdminModule } from './admin.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'online-reviewer',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    HomeModule,
    UserModule,
    AdminModule,
  ],
})
export class AppModule {}
