import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  orvibo_ids: [{ type: String, required: true }],
  selected_ids: [{ type: String }],
  hub_id: { type: String, required: true },
  assembly_type: String,
  patio_colors: [
    {
      type: String,
      enum: ['white', 'adobe', 'cameo', 'latte', 'spanish_brown', 'custom'],
    },
  ],
  rafter_size: [Number],
  louver_type: { type: String, enum: ['extruded', 'roll_formed'] },
  num_motors: Number,
  technician_name: String,
  technician_company: String,
  installation_date: Date,
  image_url: String,
  image_public_id: String,
  receipt_url: String,
  receipt_public_id: String,
  favorites_set: [
    {
      orvibo_id: String,
      state: {
        type: String,
        enum: ['close', 'open', 'quarter_open', 'semi_open', 'almost_open'],
      },
    },
  ],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceAddress',
  },
}).set('toJSON', {
  virtuals: true,
});
