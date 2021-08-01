import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CryptoGuyService } from '../../tools/cryptoguy/cryptoguy.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private cryptoService: CryptoGuyService,
  ) {}

  async findUser(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async getLoggedInUser(userID: string): Promise<User> {
    return await this.userModel
      .findOne({ _id: userID }, { password: 0, username: 0, __v: 0 })
      .exec();
  }

  async createUser(user: User): Promise<any> {
    const userExists = await this.findUser(user.username);
    if (!userExists) {
      const pwHash = await this.cryptoService.hashPassword(user.password);
      const friendData = {
        username: user.username,
        password: pwHash,
        name: user.name,
        email: user.username,
      };
      const newUser = await new this.userModel(friendData);
      return newUser.save();
    } else {
      return false;
    }
  }

  async updateUser(user: Record<string, unknown>) {
    return this.userModel.updateOne({ _id: user.id }, user);
  }
}
