import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountLoginDto } from './dto/account-login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { I18nContext } from 'nestjs-i18n';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(accountLoginDto: AccountLoginDto) {
    const user = await this.usersService.findByAccount(accountLoginDto.account);
    const i18n = I18nContext.current();
    if (!user) {
      throw new InternalServerErrorException(
        i18n.t('auth.login_error_not_exist'),
      );
    }
    return user;
  }
  async logout() {
    return 'logout';
  }
  async register(CreateUserDto: CreateUserDto) {
    const user = this.usersService.create(CreateUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
  }
}
