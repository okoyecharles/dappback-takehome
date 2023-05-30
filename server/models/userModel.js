import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, min: 6 },
    coins: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastStreak: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
