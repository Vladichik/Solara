import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String, required: true },
  phone: String,
  created_at: { type: Date, default: Date.now },
  last_name: String,
  first_name: String,
  birthday: Date,
  email: String,
  avatar: String,
  orvibo_id: String,
  orvibo_token: String,
  orvibo_refresh_token: String,
  orvibo_token_exp: Number,
  is_pro: { type: Boolean, default: false },
  smart_active: { type: Boolean, default: false },
}).set('toJSON', {
  virtuals: true,
});
