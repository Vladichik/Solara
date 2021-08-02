import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
  location_name: { type: String, required: true },
  device_name: { type: String, required: true },
  pergola_colors: [{ type: String }],
  rafter_size: Number,
  louvered_size: Number,
  num_motors: Number,
  technician_name: String,
  technician_company: String,
  installation_date: Date,
  address: mongoose.Schema.Types.Mixed,
  image_url: String,
  image_public_id: String,
}).set('toJSON', {
  virtuals: true,
});
