import * as mongoose from 'mongoose';

export const AddressManualSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['billing', 'shipping'], required: true },
  state: String,
  city: { type: String, maxlength: 100 },
  street: { type: String, maxlength: 200 },
  house_no: { type: String, maxlength: 10 },
  flat_no: { type: String, maxlength: 10 },
  zip: { type: String, maxlength: 10 },
}).set('toJSON', {
  virtuals: true,
});
