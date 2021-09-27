import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  Body,
  HttpStatus,
  HttpException,
  HttpService,
} from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../database/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
  }

  @Post('/signup')
  async signUp(@Res() res, @Body() user) {
    const createdUser = await this.userService.createUser(user);
    if (createdUser) {
      const token = this.authService.login({
        username: createdUser.username,
        id: createdUser.id,
      });
      return res.status(HttpStatus.OK).json(token);
    }
    return res.status(HttpStatus.FOUND).json({ message: 'USER_EXISTS' });
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Body() credentials) {
    const user = await this.userService.findUser(credentials.username);
    return this.authService.login({
      username: credentials.username,
      id: user.id,
    });
  }

  @Post('/forgot')
  async remindPassword(@Res() res, @Body() data) {
    // const recovered = await this.authService.remindPassword(data.email);
    // if (recovered) {
    //   return res.status(HttpStatus.OK).json();
    // } else {
    //   return res.status(HttpStatus.NO_CONTENT).json();
    // }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/forgot')
  async loginIntoOrvibo(@Res() res, @Body() data) {

  }
}
