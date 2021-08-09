import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface DeviceAddress extends Document {
  readonly user_id: mongoose.Schema.Types.ObjectId;
  readonly lat: number;
  readonly long: number;
  readonly place_name: string;
  readonly city: string;
  readonly district: string;
  readonly region: string;
  readonly country: string;
}
