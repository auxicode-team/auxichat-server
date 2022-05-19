import { Schema, Document } from "mongoose";
import * as bcrypt from "bcrypt";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: Role, default: Role.USER },
    verified: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: Gender, required: true },
    image: { type: String },
    address: { type: String },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verified;
  return obj;
};

export { UserSchema };

export interface User extends Document {
  name: string;
  email: string;
  role: Role;
  verified: boolean;
  gender: Gender;
  image: string;
  address: string;
  password: string;
  validatePassword(password: string): boolean;
}
