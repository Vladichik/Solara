import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../database/users/users.service';
import { CryptoGuyService } from '../tools/cryptoguy/cryptoguy.service';
import { User } from '../database/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private cryptoService: CryptoGuyService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user) {
      const valid = await this.cryptoService.verify(pass, user.password);
      if (valid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  login(user: Partial<User>) {
    const payload = {
      username: user.username,
      id: user.id,
    };
    return {
      access_token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
