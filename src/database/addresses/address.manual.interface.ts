import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface AddressManual extends Document {
  readonly user_id: mongoose.Schema.Types.ObjectId;
  readonly type: string;
  readonly state: string;
  readonly city: string;
  readonly street: string;
  readonly house_no: string;
  readonly flat_no: string;
  readonly zip: string;
}
