import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String, required: true },
  phone: String,
  created_at: { type: Date, default: Date.now },
  name: String,
  birthday: Date,
  email: { type: String },
  avatar: { type: String },
}).set('toJSON', {
  virtuals: true,
});
