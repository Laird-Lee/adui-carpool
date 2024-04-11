import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLoginDto } from './dto/account-login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('登录&注册')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() accountLoginDto: AccountLoginDto) {
    return await this.authService.login(accountLoginDto);
  }

  @Post('logout')
  async logout(@Request() request) {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('refresh')
  async refresh(@Request() request) {
    return await this.authService.refreshToken({
      sessionId: request.user.sessionId,
    });
  }
}
