import { Document } from 'mongoose';

export interface User extends Document {
  readonly orvibo_token: string;
  readonly orvibo_refresh_token: string;
  readonly orvibo_token_exp: number;
  readonly orvibo_id: string;
  readonly username: string;
  readonly password: string;
  readonly phone: string;
  readonly created_at: Date;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly avatar: string;
}
