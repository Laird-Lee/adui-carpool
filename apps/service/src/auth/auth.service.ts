import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountLoginDto } from './dto/account-login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { I18nContext } from 'nestjs-i18n';
import * as argon2 from 'argon2';
import { SessionService } from '../session/session.service';
import { User } from '../users/entities/user.entity';
import { Session } from '../session/entities/session.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(accountLoginDto: AccountLoginDto) {
    const user = await this.usersService.findByAccount(accountLoginDto.account);
    const i18n = I18nContext.current();
    if (!user) {
      throw new InternalServerErrorException(
        i18n.t('auth.login_error_not_exist'),
      );
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      accountLoginDto.password,
    );
    if (!isPasswordValid) {
      throw new InternalServerErrorException();
    }

    const session = await this.sessionService.create({ user });
    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      roles: user.roles,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }
  async logout() {
    return 'logout';
  }
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async getTokensData(data: {
    id: User['id'];
    roles: User['roles'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.roles ? data.roles.join(',') : '',
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.get('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.get('auth.refreshSecret', { infer: true }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
