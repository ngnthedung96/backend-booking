import { mongoConnect } from "../../boot/mongodb.mjs";
import mongoose from "mongoose";
import mongoPagination from "mongoose-aggregate-paginate";
const { Schema } = mongoose;

var HistorySchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
    },
    patientId: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
      default: "",
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
  { id: false, versionKey: "v" }
);
// ------------------------------methods-------------------------
HistorySchema.statics.createLogAction = async function (data) {
  const result = this.create(data);
  return result;
};
HistorySchema.plugin(mongoPagination);
HistorySchema.set("toJSON", { getters: true, timestamps: true });

export default mongoConnect.model("history", HistorySchema);
