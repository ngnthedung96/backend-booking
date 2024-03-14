import Users from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
// define constant
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
  // //lấy toàn bộ user ra
  getList = async (req, res, next) => {
    try {
      let { page, limit, dateRange, search } = req.query;
      const formattedLimit = Number(limit);
      const formattedPage = Number(page);
      const objCondition = {};
      if (mongoose.Types.ObjectId.isValid(search)) {
        objCondition._id = mongoose.Types.ObjectId(search);
      }
      if (dateRange) {
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
              phone: 1,
              email: 1,
              imageLink: 1,
              gender: 1,
              address: 1,
              position: 1,
              time: 1,
              status: 1,
              role: 1,
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
  // //tìm kiếm
  // // search = async (req, res, next) => {
  // //   try {
  // //     const { key } = req.params;
  // //     let result = await super.searchUser(key);
  // //     res.locals.resData = {
  // //       statusCode: 200,
  // //       message: "success",
  // //       data: {
  // //         // total: result.total,
  // //         // pages: result.pages,
  // //         docs: result.map((obj) => {
  // //           return {
  // //             // _id: obj._id,
  // //             name: obj.name,
  // //             email: obj.email,
  // //             phone: obj.phone,
  // //           };
  // //         }),
  // //       },
  // //     };
  // //     next();
  // //   } catch (e) {
  // //     next(e);
  // //   }
  // // };
  // //hàm thực hiện tìm kiếm khi bấm nút
  // search = async (req, res, next) => {
  //   try {
  //     const { data } = req.params;
  //     const page = parseInt(req.body.page) || 1;
  //     const limit = parseInt(req.body.limit) || 10;
  //     const skip = (page - 1) * limit;
  //     let result = await this.model
  //       .find({
  //         $or: [
  //           { name: { $regex: data, $options: "i" } },
  //           { email: { $regex: data, $options: "i" } },
  //           { phone: { $regex: data, $options: "i" } },
  //         ],
  //       })
  //       .skip(skip)
  //       .limit(parseInt(limit));
  //     let total = await this.model.aggregate([
  //       {
  //         $match: {
  //           $or: [
  //             { name: { $regex: data, $options: "i" } },
  //             { email: { $regex: data, $options: "i" } },
  //             { phone: { $regex: data, $options: "i" } },
  //           ],
  //         },
  //       },
  //       {
  //         $count: "total",
  //       },
  //     ]);
  //     console.log("đây là data cần tìm", total);
  //     res.locals.resData = {
  //       statusCode: 200,
  //       data: {
  //         total: total ? total[0].total : 0,
  //         docs: result.map((obj) => {
  //           return {
  //             name: obj.name,
  //             email: obj.email,
  //             phone: obj.phone,
  //             adress: obj.adress,
  //           };
  //         }),
  //       },
  //     };
  //     next();
  //     // if (total && total[0]) {

  //     // }
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  // //hàm thực hiện việc hiển thị khi bấm chuyển tra
  // search_short = async (req, res, next) => {
  //   try {
  //     const { data } = req.params;
  //     const page = parseInt(req.body.page) || 1;
  //     const limit = parseInt(req.body.limit) || 10;
  //     const skip = (page - 1) * limit;
  //     let result = await this.model
  //       .find({
  //         $or: [
  //           { name: { $regex: data, $options: "i" } },
  //           { email: { $regex: data, $options: "i" } },
  //           { phone: { $regex: data, $options: "i" } },
  //         ],
  //       })
  //       .skip(skip)
  //       .limit(parseInt(limit))
  //       .lean()
  //       .populate("resources");
  //     res.locals.resData = {
  //       statusCode: 200,
  //       data: {
  //         docs: result.map((obj) => {
  //           return {
  //             _id: obj._id,
  //             name: obj.name,
  //             phone: obj.phone,
  //             email: obj.email,
  //             status: obj.status,
  //           };
  //         }),
  //       },
  //     };
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  //tìm user theo id
  getUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
      let result = await Users.findById(id);
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: {
          name: result.name,
          phone: result.phone,
          email: result.email,
          imageLink: result.imageLink,
          gender: result.gender,
          address: result.address,
          position: result.position,
          time: result.time,
          status: result.status,
          role: result.role,
        },
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
      const { phone, email, name, password, role, gender, imageLink, address } =
        req.body;
      // check user exist, check email, name, phone
      const existUser = await this.model.find({
        $or: [
          { name: { $regex: name, $options: "i" } },
          { phone: { $regex: phone, $options: "i" } },
          { email: { $regex: email, $options: "i" } },
        ],
        status: 0,
      });
      if (!isEmpty(existUser)) {
        throw {
          statusCode: 400,
          message: "Đã tồn tại tài khoản",
        };
      }
      let result = await super.newCreate({
        name,
        phone,
        email,
        password,
        gender,
        role,
        imageLink,
        address,
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

  updateDoctorIn4 = async (req, res, next) => {
    try {
      const { name, phone, gender, imageLink, address, role } = req.body;
      const { id } = req.params;
      const formattedId = mongoose.Types.ObjectId(id);
      let doctor = await super.getEntry([
        {
          $match: {
            _id: formattedId,
          },
        },
        {
          $project: {
            id: "$_id",
            name: 1,
            phone: 1,
            gender: 1,
            role: 1,
          },
        },
      ]);
      doctor = !isEmpty(doctor) ? doctor[0] : null;
      if (!doctor) {
        throw {
          statusCode: 404,
          message: "Không tìm thấy tài khoản",
        };
      }
      const {
        name: oldName,
        phone: oldPhone,
        gender: oldGender,
        role: oldRole,
      } = doctor;
      if (role && role != oldRole) {
        if (!req.admin) {
          throw {
            statusCode: 404,
            message: "Không có quyền truy cập",
          };
        }
      }
      let result = await super.update(id, {
        name,
        phone,
        gender,
        imageLink,
        address,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  updateUserIn4 = async (req, res, next) => {
    try {
      if (!req.patient) {
        throw {
          statusCode: 404,
          message: "Không có quyền truy cập",
        };
      }
      const { name, phone, gender, imageLink, address } = req.body;
      const { id } = req.user;
      let result = await super.update(id, {
        name,
        phone,
        gender,
        imageLink,
        address,
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

  changePass = async (req, res, next) => {
    try {
      const { name, password } = req.body;

      const { id } = req.params;
      let result = await super.update(id, { name, password });
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log("hahah", id);
      let result = await super.delete(id);
      res.locals.resData = {
        statusCode: 200,
        message: "success",
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

export default new Ctrl(Users);
