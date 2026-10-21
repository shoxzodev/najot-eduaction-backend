import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  app.enableCors()

  app.setGlobalPrefix("api/v1")

  // Static fayllarni serve qilish (rasm va videolar)
  // Rasmlar: http://localhost:3000/files/{filename}
  // Videolar: http://localhost:3000/files/files/{filename}
  app.useStaticAssets(join(process.cwd(), 'src', 'uploads'), {
    prefix: '/files',
  });

  const config = new DocumentBuilder()
    .setTitle("CRM N26 group")
    .addBearerAuth()
    .build()  

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();