import Schedule from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
// define constant
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
}

export default new Ctrl(Schedule);
