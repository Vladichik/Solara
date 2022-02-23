import { Document } from 'mongoose';

export interface Contact extends Document {
  readonly email: string;
  readonly phone: string;
}
