import Users from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
// define constant
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
  // //lấy toàn bộ user ra
  // getList = async (req, res, next) => {
  //   try {
  //     let { page, limit } = req.query;
  //     let result = await super._getList({
  //       page,
  //       limit,
  //     });

  //     res.locals.resData = {
  //       statusCode: 200,
  //       data: {
  //         total: result.total,
  //         pages: result.pages,
  //         docs: result.docs.map((obj) => {
  //           return {
  //             _id: obj._id,
  //             name: obj.name,
  //             imgUrl: obj.imgUrl,
  //             email: obj.email,
  //             phone: obj.phone,
  //             password: obj.password,
  //             adress: obj.adress,
  //             accountCode: obj.accountCode,
  //             port: obj.port,
  //             role: obj.role,
  //             updatedAt: obj.updatedAt,
  //             createdAt: obj.createdAt,
  //           };
  //         }),
  //       },
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };
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
  // //tìm user theo id
  // getUserById = async (req, res, next) => {
  //   try {
  //     const id = req.params.id;
  //     let result = await Users.findById(id);
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",

  //       data: {
  //         id: result.id,
  //         name: result.name,
  //         imgUrl: result.imgUrl,
  //         email: result.email,
  //         phone: result.phone,
  //         password: result.password,
  //         adress: result.adress,
  //         role: result.role,
  //         updatedAt: result.updatedAt,
  //         createdAt: result.createdAt,
  //       },
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // create = async (req, res, next) => {
  //   try {
  //     const { name, email, phone, accountCode, password } = req.body;
  //     console.log(req.body);
  //     let result = await super.create({
  //       name,
  //       email,
  //       phone,
  //       accountCode,
  //       password,
  //     });
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: result,
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // update = async (req, res, next) => {
  //   try {
  //     const { name, phone } = req.body;
  //     const { id } = req.params;
  //     console.log(req.params);
  //     let result = await super.update(id, { name, phone });
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: result,
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // changePass = async (req, res, next) => {
  //   try {
  //     const { name, password } = req.body;

  //     const { id } = req.params;
  //     console.log(req.params);
  //     let result = await super.update(id, { name, password });
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: result,
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // forgotPass = async (req, res, next) => {
  //   try {
  //     const { email } = req.body.email;
  //     const { id } = req.params;
  //     let result = await super.update(id, { email });
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: result,
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // forgotPass2 = async (req, res, next) => {
  //   try {
  //     const { email } = req.body.email;
  //     let result = await Users.findOne(email);
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: result,
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  // delete = async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     console.log("hahah", id);
  //     let result = await super.delete(id);
  //     res.locals.resData = {
  //       statusCode: 200,
  //       message: "success",
  //       data: {
  //         id: result._id,
  //       },
  //     };
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  create = async (req, res, next) => {
    try {
      const { phone, email, name, password, roleId, gender } = req.body;
      let result = await super.newCreate({
        name,
        phone,
        email,
        password,
        gender,
        roleId,
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
}

export default new Ctrl(Users);
