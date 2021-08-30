import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OrviboService } from './orvibo.service';

@Controller('orvibo')
export class OrviboController {
  constructor(private orviboService: OrviboService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/login')
  async login(@Request() req, @Body() credentials) {
    const user = await this.orviboService.login(credentials);
    return user;
  }
}
