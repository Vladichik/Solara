import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userID')
  async getUser(@Res() res, @Param('userID') userID) {
    if (userID) {
      const user = await this.userService.getLoggedInUser(userID);
      if (user) {
        return res.status(HttpStatus.OK).json(user);
      }
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'User ID was not supplied' });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/userID')
  async createCategory(@Res() res, @Param('userID') userID, @Body() payload) {
    if (userID) {
      const updated = await this.userService.updateUser(userID, payload);
      if (updated) {
        return res.status(HttpStatus.OK).json(updated);
      }
      return res
        .status(HttpStatus.NOT_IMPLEMENTED)
        .json({ message: 'User Update Failed' });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'You are not authorized to perform this action' });
  }
}
