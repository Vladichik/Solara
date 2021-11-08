import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  async findUsers(userIDs: ObjectId[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIDs } });
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
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.username,
      };
      const newUser = await new this.userModel(friendData);
      return newUser.save();
    } else {
      return false;
    }
  }

  async updateUser(userID: string, user: Partial<User>) {
    return this.userModel.updateOne({ _id: userID }, user);
  }
}
