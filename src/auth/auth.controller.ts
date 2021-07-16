import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../database/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signup')
  async signUp(@Res() res, @Body() user) {
    const createdFriend = await this.userService.createUser(user);
    if (createdFriend) {
      return res.status(HttpStatus.OK).json(createdFriend);
    }
    throw new HttpException(
      {
        status: HttpStatus.FOUND,
        error: 'USER_EXISTS',
      },
      HttpStatus.FOUND,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login({
      username: req.user._doc.username,
      id: req.user._doc.id,
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
}
