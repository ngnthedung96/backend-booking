import Clinics from "./model.mjs";
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
  // //lấy toàn bộ clinic ra
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
              { address: { $regex: ".*" + search + ".*", $options: "i" } },
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
              address: 1,
              introduce: 1,
              strength: 1,
              equipment: 1,
              process: 1,
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

  //tìm clinic theo id
  getClinicById = async (req, res, next) => {
    try {
      const id = req.params.id;
      let result = await Clinics.findById(id);
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
      const { name, description, address } = req.body;
      const image = {
        id: "",
        previewUrl: "",
        path: "",
      };
      if (req.files) {
        //  lấy đường dẫn ảnh
        const { file } = req.files;
        if (!file) {
          return {
            status: false,
            message: "Chưa có ảnh tải lên",
          };
        }
        const getImgUrl = await imageDropboxService.getImgUrl(file);
        if (!getImgUrl.status || !getImgUrl.data) {
          throw {
            statusCode: 400,
            message: getImgUrl.message,
          };
        }
        const { pathLowerImg, idImg, previewUrl } = getImgUrl.data;
        image.id = idImg;
        image.previewUrl = previewUrl;
        image.path = pathLowerImg;
      }
      const currentTime = moment().unix();
      let result = await super.newCreate({
        name,
        description,
        address,
        image,
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

  updateClinicIn4 = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { name, description, address } = req.body;
      const { id } = req.params;
      const currentTime = moment().unix();
      const formattedId = mongoose.Types.ObjectId(id);

      const image = {
        id: "",
        previewUrl: "",
        path: "",
      };
      if (req.files) {
        //  lấy đường dẫn ảnh
        const { file } = req.files;
        if (!file) {
          return {
            status: false,
            message: "Chưa có ảnh tải lên",
          };
        }
        const getImgUrl = await imageDropboxService.getImgUrl(file);
        if (!getImgUrl.status || !getImgUrl.data) {
          throw {
            statusCode: 400,
            message: getImgUrl.message,
          };
        }
        const { pathLowerImg, idImg, previewUrl } = getImgUrl.data;
        image.id = idImg;
        image.previewUrl = previewUrl;
        image.path = pathLowerImg;
      }
      let result = await super.update(formattedId, {
        name,
        description,
        address,
        image,
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

export default new Ctrl(Clinics);
