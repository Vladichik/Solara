import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface Device extends Document {
  readonly user_id: mongoose.Schema.Types.ObjectId;
  readonly location_name: string;
  readonly device_name: string;
  readonly pergola_colors: string[];
  readonly rafter_size: number;
  readonly louvered_size: number;
  readonly num_motors: number;
  readonly technician_name: string;
  readonly technician_company: string;
  readonly installation_date: Date;
  readonly address: mongoose.Schema.Types.Mixed;
  readonly image_url: string;
  readonly image_public_id: string;
}
