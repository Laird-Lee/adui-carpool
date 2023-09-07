import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { AllConfigType } from './config/common/config.type';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('ADui Carpool Api')
    .setDescription('The ADui Carpool API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));

  console.log(`
           _____        _    _____                             _
     /\\   |  __ \\      (_)  / ____|                           | |
    /  \\  | |  | |_   _ _  | |     __ _ _ __ _ __   ___   ___ | |
   / /\\ \\ | |  | | | | | | | |    / _\` | '__| '_ \\ / _ \\ / _ \\| |
  / ____ \\| |__| | |_| | | | |___| (_| | |  | |_) | (_) | (_) | |
 /_/    \\_|_____/ \\__,_|_|  \\_____\\__,_|_|  | .__/ \\___/ \\___/|_|
                                            | |
                                            |_|
`);

  console.log(`
      Api running at: ${configService.getOrThrow('app.host', {
        infer: true,
      })}:${configService.getOrThrow('app.port', {
    infer: true,
  })}/${configService.getOrThrow('app.apiPrefix', { infer: true })}

      Swagger running at: ${configService.getOrThrow('app.host', {
        infer: true,
      })}:${configService.getOrThrow('app.port', { infer: true })}/api-docs
  `);
}
void bootstrap();
