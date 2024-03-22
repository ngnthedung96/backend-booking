/* eslint-disable no-restricted-syntax */
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
import { mongoConnect } from "../../boot/mongodb.mjs";
import AutoIncrement from "mongoose-sequence";

const { Schema } = mongoose;

const MarkdownSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
    },
    specialtyId: {
      type: Schema.Types.ObjectId,
    },
    introduce: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    updatedTime: {
      type: Number,
      default: 0,
    },
    time: {
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
  },
  {
    id: false,
    versionKey: "v",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MarkdownSchema.plugin(mongoPagination);
MarkdownSchema.set("toJSON", { getters: true });
export default mongoConnect.model("markdown", MarkdownSchema);
