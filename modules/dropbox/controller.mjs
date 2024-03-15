import DropboxDb from "./model.mjs";
import CoreCtrl from "../core.mjs";
import { DropboxSvc } from "../../services/index.mjs";
import moment from "moment";
import { isEmpty } from "ramda";
import mongoose from "mongoose";
// make constant
const dropboxService = new DropboxSvc();
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }

  // hàm này thực hiện lấy ra toàn bộ list Dropbox
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

  // hàm này lấy link authorize code
  getUrlAuthCode = async (req, res, next) => {
    try {
      const urlAuthCode = await dropboxService.getAuthUrl();
      console.log(urlAuthCode);
      if (!urlAuthCode.status || !urlAuthCode.data) {
        throw {
          statusCode: 400,
          message: urlAuthCode.message,
        };
      }
      res.locals.resData = {
        statusCode: 200,
        message: "Lấy đường dẫn xác thực Dropbox thành công",
        data: urlAuthCode.data,
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  // hàm thực hiện việc thêm mới Dropbox
  create = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      let { clientId, clientSecret, note, isDefault } = req.body;
      const currentTime = moment().unix();
      const existDropbox = await this.model.find({
        $or: [{ clientId }, { clientSecret }],
      });
      if (!isEmpty(existDropbox)) {
        throw {
          statusCode: 400,
          message: "Đã tồn tại tài khoản",
        };
      }
      if (isDefault) {
        const checkExistDefault = await this.model.findOneAndUpdate(
          {
            _id: {
              $ne: formattedId,
            },
            status: dropboxService.STATUS_WORKING,
          },
          {
            status: dropboxService.STATUS_DISABLED,
          },
          { useFindAndModify: false }
        );
      }
      const result = await super.create({
        clientId,
        clientSecret,
        note,
        time: currentTime,
        updatedTime: currentTime,
        status: isDefault
          ? dropboxService.STATUS_WORKING
          : dropboxService.STATUS_DISABLED,
      });

      res.locals.resData = {
        statusCode: 200,
        message: "Cấu hình tài khoản thành công",
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
      const { clientId, clientSecret, note, isDefault } = req.body;
      const { id } = req.params;
      const formattedId = mongoose.Types.ObjectId(id);
      const currentTime = moment().unix();
      let dropboxAcc = await super.getEntry([
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
      dropboxAcc = !isEmpty(dropboxAcc) ? dropboxAcc[0] : null;
      if (!dropboxAcc) {
        throw {
          statusCode: 404,
          message: "Không tìm thấy tài khoản",
        };
      }
      const {
        clientId: oldClientId,
        clientSecret: oldClientSecret,
        note: oldNote,
      } = dropboxAcc;
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
            status: dropboxService.STATUS_WORKING,
          },
          {
            status: dropboxService.STATUS_DISABLED,
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
          ? dropboxService.STATUS_WORKING
          : dropboxService.STATUS_DISABLED,
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

  // hàm thực hiện xóa Dropbox
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

export default new Ctrl(DropboxDb);
