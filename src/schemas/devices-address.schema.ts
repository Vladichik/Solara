import * as mongoose from 'mongoose';

export const DevicesAddressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  lat: Number,
  long: Number,
  place_name: String,
  city: String,
  district: String,
  region: String,
  country: String,
}).set('toJSON', {
  virtuals: true,
});
