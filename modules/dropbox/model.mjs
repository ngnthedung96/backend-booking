import { mongoConnect } from "../../boot/mongodb.mjs";
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
const { Schema } = mongoose;

var DropboxSchema = new Schema(
  {
    clientId: {
      type: String,
      default: "",
    },
    clientSecret: {
      type: String,
      default: "",
    },
    accessToken: {
      type: String,
      default: "",
    },
    expiredTime: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    note: {
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
  },
  { id: false, versionKey: "v" }
);
// ------------------------------methods-------------------------
DropboxSchema.plugin(mongoPagination);
DropboxSchema.set("toJSON", { getters: true, timestamps: true });

export default mongoConnect.model("dropboxes", DropboxSchema);
