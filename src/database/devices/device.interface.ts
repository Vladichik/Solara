import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface Device extends Document {
  readonly user_id: mongoose.Schema.Types.ObjectId;
  readonly orvibo_ids: string[];
  readonly location_name: string;
  readonly device_name: string;
  readonly patio_colors: string[];
  readonly rafter_size: number[];
  readonly louver_size: number[];
  readonly louver_type: string;
  readonly amount_of_motors: number;
  readonly motor_type: string;
  readonly technician_name: string;
  readonly technician_company: string;
  readonly installation_date: Date;
  readonly lock_snow: Date;
  readonly lock_rain: Date;
  readonly lock_wind: Date;
  readonly address: mongoose.Schema.Types.Mixed;
  readonly image_url: string;
  readonly image_public_id: string;
  readonly favorites_set: any;
}
