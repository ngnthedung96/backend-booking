/* eslint-disable no-restricted-syntax */
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
import { mongoConnect } from "../../boot/mongodb.mjs";
import AutoIncrement from "mongoose-sequence";

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    currentNumber: {
      type: Number,
      default: 0,
    },
    maxNumber: {
      type: Number,
      default: 0,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
    },
    timeStart: {
      type: Number,
      default: 0,
    },
    timeEnd: {
      type: Number,
      default: 0,
    },
    timeCreate: {
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

ScheduleSchema.plugin(mongoPagination);
ScheduleSchema.set("toJSON", { getters: true });
export default mongoConnect.model("schedules", ScheduleSchema);
