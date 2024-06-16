import { Schema, model } from "mongoose";

// create an interface
export interface IUser {
  //optional id
  _id?: string;
  username: string;
  password: string;
  availableMoney: number;
  // this will be an ID of items purchased
  // purchasedItems: string[];
}

// creating the schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
  availableMoney: { type: Number, default: 5000 },
  // purchasedItems:
});

// creating a model of type IUser, calling collection and passing the schema: user
export const UserModel = model<IUser>("user", UserSchema);
