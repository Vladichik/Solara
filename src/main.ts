import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('v1');
  await app.listen(process.env.PORT || 5200);
  console.log('======== SOLARA SERVER IS ON ========');
}
bootstrap().then(() => {});
