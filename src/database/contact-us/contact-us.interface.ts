import { Document } from 'mongoose';

export interface ContactUs extends Document {
  readonly email: string;
  readonly phone: string;
}
