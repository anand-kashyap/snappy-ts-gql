import { Schema } from 'mongoose';
import { db } from '../db';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = db.model('users', userSchema);

export { User };
