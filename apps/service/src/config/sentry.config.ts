import { IsEnum, IsOptional, IsUrl } from 'class-validator';
import { Environment } from './common/config.enum';
import { SentryConfig } from './common/config.type';
import { registerAs } from '@nestjs/config';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsUrl()
  SENTRY_SERVICE_DSN: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;
}

export default registerAs<SentryConfig>('sentry', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    dsn: process.env.SENTRY_SERVICE_DSN,
    environment:
      process.env.NODE_ENV === 'development' ? 'dev' : process.env.NODE_ENV,
  };
});
