import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, TokenData } from './user.interface';
import { CryptoGuyService } from '../../tools/cryptoguy/cryptoguy.service';
import { OrviboService } from '../../third-party-apis/orvibo/orvibo.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private cryptoService: CryptoGuyService,
    private orviboService: OrviboService,
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
      const encryptedPW = await this.cryptoService.encrypt(user.password);
      const friendData = {
        username: user.username,
        password: encryptedPW,
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

  tokenIsValid(user: TokenData) {
    const tokensData = user.token;
    const tokenExpiry = user.token_exp;
    if (tokensData && tokenExpiry) {
      const date = new Date();
      date.setUTCSeconds(tokenExpiry);
      return date > new Date();
    }
    return false;
  }

  /**
   * Function that validates tokens
   * if token is expired we refresh it in Orvibo then update
   * updated token in our database.
   * Than return data with updated tokens
   * @param tokens
   * Vlad. 20/11/21
   */
  async checkUsersTokens(tokens: Partial<TokenData[]>): Promise<TokenData[]> {
    const seen = new Set();
    const uniqueList = tokens.filter((el) => {
      const duplicate = seen.has(el.user_id);
      seen.add(el.user_id);
      return !duplicate;
    });
    const invalidTokenUsers = uniqueList.filter(
      (user) => !this.tokenIsValid(user),
    );
    if (invalidTokenUsers && invalidTokenUsers.length) {
      Logger.log(`${invalidTokenUsers.length} users have expired tokens`);
      const refreshPromises = uniqueList.map((item) => {
        return new Promise((resolve) => {
          this.orviboService
            .refreshToken({ refresh_token: item.refresh_token })
            .then((token) => {
              if (token.refresh_token) {
                this.updateUser(item.user_id, {
                  orvibo_token: token.access_token,
                  orvibo_refresh_token: token.refresh_token,
                  orvibo_token_exp: token.expires_in,
                }).then(() => {
                  Logger.log(`Token refreshed for user ${item.user_id}`);
                  resolve({
                    user_id: item.user_id,
                    orvibo_token: token.access_token,
                    orvibo_refresh_token: token.refresh_token,
                    orvibo_token_exp: token.expires_in,
                  });
                });
              }
            });
        });
      });
      return Promise.all(refreshPromises).then((promises) => {
        return tokens.map((token) => {
          const hasUpdated = promises.find(
            (p: TokenData) => p.user_id === token.user_id,
          );
          if (hasUpdated) {
            // @ts-ignore
            token.token = hasUpdated.orvibo_token;
          }
          return token;
        });
      });
    } else {
      return tokens;
    }
  }
}
