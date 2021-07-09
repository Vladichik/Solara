import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
  readonly phone: string;
  readonly created_at: Date;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}
