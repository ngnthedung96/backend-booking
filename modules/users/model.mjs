/* eslint-disable no-restricted-syntax */
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
import { mongoConnect } from "../../boot/mongodb.mjs";
import AutoIncrement from "mongoose-sequence";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    image: {
      id: {
        type: String,
        default: "",
      },
      previewUrl: {
        type: String,
        default: "",
      },
      path: {
        type: String,
        default: "",
      },
    },
    gender: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      default: 0,
    },
    salt: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    codeChangePass: {
      type: String,
      default: "",
    },
    time: {
      type: Number,
      default: 0,
    },
    updatedTime: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    id: false,
    versionKey: "v",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.plugin(mongoPagination);
UserSchema.set("toJSON", { getters: true });
export default mongoConnect.model("users", UserSchema);
