import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String, required: true },
  phone: String,
  created_at: { type: Date, default: Date.now },
  name: String,
  email: { type: String },
  avatar: { type: String },
});
