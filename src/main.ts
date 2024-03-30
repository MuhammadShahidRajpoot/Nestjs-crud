import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express'
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create< NestExpressApplication >(AppModule);
  app.useStaticAssets( path.join( __dirname, '../uploads') )

  // Configure CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(4000);
}
bootstrap();
