import Specialties from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
import { DefaultSvc, ImageDropboxSvc } from "../../services/index.mjs";

// define constant
const defaultService = new DefaultSvc();
const imageDropboxService = new ImageDropboxSvc();
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }

  create = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { doctorId, clinicId, specialtyId, introduce, content } = req.body;
      const currentTime = moment().unix();
      let result = await super.newCreate({
        doctorId,
        clinicId,
        specialtyId,
        introduce,
        content,
        updatedTime: currentTime,
        time: currentTime,
        status: defaultService.STATUS_WORKING,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "Tạo thành công",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  updateSpecialtyIn4 = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { doctorId, clinicId, specialtyId, introduce, content } = req.body;
      const { id } = req.params;
      const currentTime = moment().unix();
      const formattedId = mongoose.Types.ObjectId(id);

      let result = await super.update(formattedId, {
        doctorId,
        clinicId,
        specialtyId,
        introduce,
        content,
        updatedTime: currentTime,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "Chỉnh sửa thành công",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { id } = req.params;
      const currentTime = moment().unix();
      let result = await super.update(id, {
        status: defaultService.STATUS_DISABLED,
        updatedTime: currentTime,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "Xóa mô tả thành công",
        data: {
          id: result._id,
        },
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new Ctrl(Specialties);
