import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  orvibo_id: { type: String, required: true },
  pergola_colors: [{ type: String }],
  rafter_size: Number,
  louvered_size: Number,
  num_motors: Number,
  technician_name: String,
  technician_company: String,
  installation_date: Date,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceAddress',
  },
  image_url: String,
  image_public_id: String,
}).set('toJSON', {
  virtuals: true,
});
