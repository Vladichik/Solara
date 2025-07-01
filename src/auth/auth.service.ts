import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../database/users/users.service';
import { CryptoGuyService } from '../tools/cryptoguy/cryptoguy.service';
import { User } from '../database/users/user.interface';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private cryptoService: CryptoGuyService,
    // private mailService: MailerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user) {
      const decrypted = await this.cryptoService.decrypt(user.password);
      if (pass === decrypted) {
        const { ...result } = user;
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

  async remindPassword(username: string) {
    const user = await this.usersService.findUser(username);
    if (user) {
      // const password = await this.cryptoService.decrypt(user.password);
      // await this.mailService.sendMail({
      //   to: username,
      //   subject: 'Solara password reminder',
      //   html: `Dear customer please find attached password to your Solara account <b>${password}</b>`,
      // });
      return true;
    } else {
      return false;
    }
  }
}
