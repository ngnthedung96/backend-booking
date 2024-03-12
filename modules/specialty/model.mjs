/* eslint-disable no-restricted-syntax */
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
import { mongoConnect } from "../../boot/mongodb.mjs";
import AutoIncrement from "mongoose-sequence";

const { Schema } = mongoose;

const SpecialtySchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imageLink: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 0,
    },
    orders: {
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

SpecialtySchema.plugin(mongoPagination);
SpecialtySchema.set("toJSON", { getters: true });
export default mongoConnect.model("specialties", SpecialtySchema);
