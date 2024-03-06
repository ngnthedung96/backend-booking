/* eslint-disable no-restricted-syntax */
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
import { mongoConnect } from "../../boot/mongodb.mjs";
import AutoIncrement from "mongoose-sequence";

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    statusId: {
      type: Number,
      default: 0,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
    },
    patientId: {
      type: Schema.Types.ObjectId,
    },
    time: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    status: {
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

BookingSchema.plugin(mongoPagination);
BookingSchema.set("toJSON", { getters: true });
export default mongoConnect.model("booking", BookingSchema);
