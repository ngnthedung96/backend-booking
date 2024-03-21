import Schedule from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
import mongoose from "mongoose";
import { DefaultSvc, ScheduleSvc } from "../../services/index.mjs";
import { isEmpty } from "ramda";
// define constant
const defaultService = new DefaultSvc();
const scheduleService = new ScheduleSvc();
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
  // hàm này thực hiện lấy ra toàn bộ list schedule
  getList = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await super._getList({
        page,
        limit,
      });
      res.locals.resData = {
        statusCode: 200,
        data: {
          total: result.total,
          pages: result.pages,
          docs: result.docs.map((obj) => ({
            _id: obj._id,
            name: obj.name,
            status: obj.status,
          })),
        },
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  // hàm thực hiện việc thêm mới schedule
  create = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { doctorId, scheduleData, month } = req.body;
      const currentYear = moment().year();
      const getArrData = scheduleService.formatDaySchedule(
        scheduleData,
        doctorId,
        currentYear,
        month
      );
      if (!getArrData.status || !getArrData.data) {
        throw {
          statusCode: 400,
          message: getArrData.message,
        };
      }
      const { data: arrData } = getArrData;
      const allPromise = [];
      for (let data of arrData) {
        const findPromise = new Promise(async (resolve, reject) => {
          const { timeStart, timeEnd, doctorId } = data;
          const existSchedule = await this.model.checkExistSchedule(
            timeStart,
            timeEnd,
            doctorId
          );
          if (existSchedule) {
            reject(
              new Error(
                `Lịch được tạo đã trùng với lịch đã được tạo! Vào ${moment
                  .unix(timeStart)
                  .format("HH:mm DD/MM/YYYY")}`
              )
            );
          }
          resolve();
        });
        allPromise.push(findPromise);
      }
      const checkAll = await Promise.all(allPromise);

      const result = await super.createMany(arrData);
      res.locals.resData = {
        statusCode: 200,
        message: "Tạo lịch thành công",
        data: result,
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { currentNumber, maxNumber, doctorId, timeStart, timeEnd } =
        req.body;
      const { id } = req.params;
      const formattedId = mongoose.Types.ObjectId(id);
      const currentTime = moment().unix();
      let scheduleAcc = await super.getEntry([
        {
          $match: {
            _id: formattedId,
          },
        },
        {
          $project: {
            id: "$_id",
            clientId: 1,
            clientSecret: 1,
          },
        },
      ]);
      scheduleAcc = !isEmpty(scheduleAcc) ? scheduleAcc[0] : null;
      if (!scheduleAcc) {
        throw {
          statusCode: 404,
          message: "Không tìm thấy tài khoản",
        };
      }
      const {
        clientId: oldClientId,
        clientSecret: oldClientSecret,
        note: oldNote,
      } = scheduleAcc;
      if (clientId != oldClientId) {
        const existUser = await this.model.find({
          clientId: clientId,
        });
        if (!isEmpty(existUser)) {
          throw {
            statusCode: 400,
            message: "Đã tồn tại client id",
          };
        }
      }
      if (clientSecret != oldClientSecret) {
        const existUser = await this.model.find({
          clientSecret: clientSecret,
        });
        if (!isEmpty(existUser)) {
          throw {
            statusCode: 400,
            message: "Đã tồn tại client secret",
          };
        }
      }
      if (isDefault) {
        const checkExistDefault = await this.model.findOneAndUpdate(
          {
            _id: {
              $ne: formattedId,
            },
            status: scheduleService.STATUS_WORKING,
          },
          {
            status: scheduleService.STATUS_DISABLED,
          },
          { useFindAndModify: false }
        );
      }
      const result = await super.update(id, {
        clientId,
        clientSecret,
        note,
        updatedTime: currentTime,
        status: isDefault
          ? scheduleService.STATUS_WORKING
          : scheduleService.STATUS_DISABLED,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: result,
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  // hàm thực hiện xóa schedule
  delete = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { id } = req.params;
      const result = await super.delete(id);
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: {
          id: result._id,
          name: result.name,
        },
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default new Ctrl(Schedule);
