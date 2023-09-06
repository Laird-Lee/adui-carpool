import {Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new UnauthorizedException()
  }
}
