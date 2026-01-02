import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

// User Schema - defines the structure of user documents in MongoDB
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Converts email to lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'], // Email validation
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default when querying
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// pre-save hook runs automatically before saving a document to the database
userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt (random data) to make hash more secure
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
