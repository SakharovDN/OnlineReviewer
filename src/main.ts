import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';

async function StartApp() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  await app.listen(3000, () => console.log('App started on port 3000'));
}
StartApp();
