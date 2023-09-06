import { HttpException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'https://893262f51e867f452e6ab86cf2c884ab@o985795.ingest.sentry.io/4505831510179840',
      debug: true,
      environment: 'dev',
      release: 'some_release', // must create a release in sentry.io dashboard
      logLevels: ['debug'], //based on sentry.io loglevel //
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => 200 > exception.getStatus(), // Only report 500 errors
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
