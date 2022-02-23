import * as mongoose from 'mongoose';

export const ContactUsSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
});
