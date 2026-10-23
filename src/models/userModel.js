import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [2, "Username cannot be less than 2 characters"],
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: [8, "Password cannot be less than 8 characters"],
  },
});

const User = model("user", userSchema);

export default User;
