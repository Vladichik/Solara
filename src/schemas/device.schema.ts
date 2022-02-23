import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  orvibo_ids: [{ type: String, required: true }],
  selected_ids: [{ type: String }],
  hub_id: { type: String, required: true },
  assembly_type: String,
  rafter_size: [Number],
  louver_size: [Number],
  louver_type: { type: String, enum: ['extruded', 'roll_formed'] },
  amount_of_motors: Number,
  technician_name: String,
  technician_company: String,
  installation_date: Date,
  image_url: String,
  image_public_id: String,
  receipt_url: String,
  receipt_public_id: String,
  lock_snow: Date,
  lock_rain: Date,
  lock_wind: Date,
  motor_type: { type: String, enum: ['SITO_MOTOR', 'TIM_MOTOR'] },
  patio_colors: [
    {
      type: String,
      enum: ['white', 'adobe', 'cameo', 'latte', 'spanish_brown', 'custom'],
    },
  ],
  favorites_set: [
    {
      orvibo_id: String,
      state: {
        type: String,
        enum: ['CLOSE', 'OPEN', 'QUARTER_OPEN', 'SEMI_OPEN', 'ALMOST_OPEN'],
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
