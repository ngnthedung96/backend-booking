import Specialties from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
import { DefaultSvc } from "../../services/index.mjs";
// define constant
const defaultService = new DefaultSvc();
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
  // //lấy toàn bộ specialty ra
  getList = async (req, res, next) => {
    try {
      let { page, limit, dateRange, search } = req.query;
      const formattedLimit = Number(limit);
      const formattedPage = Number(page);
      const objCondition = {};
      if (search) {
        if (mongoose.Types.ObjectId.isValid(search)) {
          objCondition._id = mongoose.Types.ObjectId(search);
        } else {
          objCondition = {
            ...objCondition,
            $or: [
              { name: { $regex: ".*" + search + ".*", $options: "i" } },
              { description: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
          };
        }
      } else if (dateRange) {
        const dateArr = dateRange.split("-");
        const startDate = dateArr[0];
        const formattedStartDate = moment(startDate, "DD/MM/YYYY")
          .startOf("day")
          .unix();
        const endDate = dateArr[1];
        const formattedEndDate = moment(endDate, "DD/MM/YYYY")
          .endOf("day")
          .unix();
        objCondition.time = {
          $gt: formattedStartDate,
          $lt: formattedEndDate,
        };
      }
      let result = await super.getPagination(
        [
          {
            $match: objCondition,
          },
          {
            $project: {
              id: "$_id",
              name: 1,
              description: 1,
              imageLink: 1,
              status: 1,
              updatedTime: 1,
            },
          },
          { $sort: { id: -1 } },
        ],
        {
          limit: formattedLimit,
          page: formattedPage,
        }
      );
      if (!isEmpty(result)) {
        res.locals.resData = {
          statusCode: 200,
          data: {
            total: result.total,
            pages: result.pages,
            docs: result.docs,
          },
          message: "Thành công",
        };
      } else {
        throw {
          statusCode: 400,
          message: "Không có bản ghi nào cả",
        };
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  //tìm specialty theo id
  getSpecialtyById = async (req, res, next) => {
    try {
      const id = req.params.id;
      let result = await Specialties.findById(id);
      res.locals.resData = {
        statusCode: 200,
        message: "Thành công",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { name, description, imageLink } = req.body;
      const currentTime = moment().unix();
      let result = await super.newCreate({
        name,
        description,
        imageLink,
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
      const { name, description, imageLink } = req.body;
      const { id } = req.params;
      const currentTime = moment().unix();
      const formattedId = mongoose.Types.ObjectId(id);
      let result = await super.update(formattedId, {
        name,
        description,
        imageLink,
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
        message: "Xóa phòng khám thành công",
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
