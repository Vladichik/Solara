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
  @Put('/update')
  async createCategory(@Res() res, @Body() payload) {
    // const surveyId = category.survey_id;
    // const newCategory = await this.categoryService.createCategory(category);
    // await this.surveyService.updateSurveyRelatedCategories(
    //   surveyId,
    //   newCategory.category_id,
    //   true,
    // );
    // return res.status(HttpStatus.OK).json(newCategory);
  }
}
