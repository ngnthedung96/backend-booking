import Users from "./model.mjs";
import CoreCtrl from "../core.mjs";
import moment from "moment";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
import { DropboxSvc, ImageDropboxSvc, UserSvc } from "../../services/index.mjs";
// define constant
const userService = new UserSvc();
const dropboxService = new DropboxSvc();
const imageDropboxService = new ImageDropboxSvc();
class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }
  // --------------------doctor------------------------
  // //lấy toàn bộ doctor ra
  getListDoctor = async (req, res, next) => {
    try {
      let {
        page,
        limit,
        dateRange,
        search,
        isSpecialty,
        isClinic,
        isSchedule,
      } = req.query;
      const formattedLimit = Number(limit);
      const formattedPage = Number(page);
      let objCondition = {
        role: userService.ROLE_DOCTOR,
      };
      if (search) {
        if (mongoose.Types.ObjectId.isValid(search)) {
          objCondition._id = mongoose.Types.ObjectId(search);
        } else {
          objCondition = {
            ...objCondition,
            $or: [
              { name: { $regex: ".*" + search + ".*", $options: "i" } },
              { phone: { $regex: ".*" + search + ".*", $options: "i" } },
              { email: { $regex: ".*" + search + ".*", $options: "i" } },
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
      const aggregation = [
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
      ];
      if (isSpecialty || isClinic) {
        const pipelineLookup = [
          {
            $project: {
              id: "$_id",
              doctorId: 1,
              clinicId: 1,
              specialtyId: 1,
            },
          },
        ];
        aggregation.push({
          $lookup: {
            from: "doctor-clinic-specialty",
            localField: "_id",
            foreignField: "doctorId",
            as: "doctorClinicSpecialty",
            pipeline: pipelineLookup,
          },
        });
        if (isSpecialty) {
          pipelineLookup.push({
            $lookup: {
              from: "specialties",
              localField: "specialtyId",
              foreignField: "_id",
              as: "specialties",
              pipeline: [
                {
                  $project: {
                    id: "$_id",
                    name: 1,
                    description: 1,
                    imageLink: 1,
                  },
                },
              ],
            },
          });
        }
        if (isClinic) {
          pipelineLookup.push({
            $lookup: {
              from: "clinics",
              localField: "clinicId",
              foreignField: "_id",
              as: "clinics",
              pipeline: [
                {
                  $project: {
                    id: "$_id",
                    name: 1,
                    description: 1,
                    imageLink: 1,
                  },
                },
              ],
            },
          });
        }
      }

      if (isSchedule) {
        aggregation.push({
          $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "doctorId",
            as: "schedules",
            pipeline: [
              {
                $project: {
                  id: "$_id",
                  currentNumber: 1,
                  maxNumber: 1,
                  doctorId: 1,
                  timeStart: 1,
                  timeEnd: 1,
                },
              },
            ],
          },
        });
      }
      let result = await super.getPagination(aggregation, {
        limit: formattedLimit,
        page: formattedPage,
      });
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
  //tìm user theo id
  getDoctorById = async (req, res, next) => {
    try {
      let { isSpecialty, isClinic, isSchedule, isMarkdown } = req.query;
      const id = req.params.id;
      const formattedId = mongoose.Types.ObjectId(id);
      let objCondition = {
        _id: formattedId,
      };
      const aggregation = [
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
      ];
      if (isSpecialty || isClinic) {
        const pipelineLookup = [
          {
            $project: {
              id: "$_id",
              doctorId: 1,
              clinicId: 1,
              specialtyId: 1,
            },
          },
        ];
        aggregation.push({
          $lookup: {
            from: "doctor-clinic-specialty",
            localField: "_id",
            foreignField: "doctorId",
            as: "doctorClinicSpecialty",
            pipeline: pipelineLookup,
          },
        });
        if (isSpecialty) {
          pipelineLookup.push({
            $lookup: {
              from: "specialties",
              localField: "specialtyId",
              foreignField: "_id",
              as: "specialties",
              pipeline: [
                {
                  $project: {
                    id: "$_id",
                    name: 1,
                    description: 1,
                    imageLink: 1,
                  },
                },
              ],
            },
          });
        }
        if (isClinic) {
          pipelineLookup.push({
            $lookup: {
              from: "clinics",
              localField: "clinicId",
              foreignField: "_id",
              as: "clinics",
              pipeline: [
                {
                  $project: {
                    id: "$_id",
                    name: 1,
                    description: 1,
                    imageLink: 1,
                  },
                },
              ],
            },
          });
        }
      }

      if (isSchedule) {
        aggregation.push({
          $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "doctorId",
            as: "schedules",
            pipeline: [
              {
                $project: {
                  id: "$_id",
                  currentNumber: 1,
                  maxNumber: 1,
                  doctorId: 1,
                  timeStart: 1,
                  timeEnd: 1,
                },
              },
            ],
          },
        });
      }
      if (isMarkdown) {
        aggregation.push({
          $lookup: {
            from: "markdowns",
            localField: "_id",
            foreignField: "doctorId",
            as: "markdowns",
            pipeline: [
              {
                $project: {
                  id: "$_id",
                  intro: 1,
                  content: 1,
                },
              },
            ],
          },
        });
      }
      let result = await super.getEntry(aggregation);
      if (!isEmpty(result)) {
        res.locals.resData = {
          statusCode: 200,
          message: "success",
          data: result,
        };
        next();
      } else {
        throw {
          statusCode: 400,
          message: "Không tìm thấy bác sĩ",
        };
      }
    } catch (err) {
      next(err);
    }
  };
  updateDoctorIn4 = async (req, res, next) => {
    try {
      const { name, phone, gender, address, role } = req.body;
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
      const { role: oldRole } = doctor;
      if (role && role != oldRole) {
        if (!req.admin) {
          throw {
            statusCode: 404,
            message: "Không có quyền truy cập",
          };
        }
      }
      if (phone != oldPhone) {
        const existUser = await this.model.find({
          phone,
        });
        if (!isEmpty(existUser)) {
          throw {
            statusCode: 400,
            message: "Đã tồn tại số điện thoại",
          };
        }
      }
      const currentTime = moment().unix();
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
      let result = await super.update(id, {
        name,
        phone,
        gender,
        image,
        address,
        updatedTime: currentTime,
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

  // --------------------user-------------------------
  // //lấy toàn bộ user ra
  getListUser = async (req, res, next) => {
    try {
      let { page, limit, dateRange, search } = req.query;
      const formattedLimit = Number(limit);
      const formattedPage = Number(page);
      let objCondition = {};
      if (search) {
        if (mongoose.Types.ObjectId.isValid(search)) {
          objCondition._id = mongoose.Types.ObjectId(search);
        } else {
          objCondition = {
            ...objCondition,
            $or: [
              { name: { $regex: ".*" + search + ".*", $options: "i" } },
              { phone: { $regex: ".*" + search + ".*", $options: "i" } },
              { email: { $regex: ".*" + search + ".*", $options: "i" } },
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

      const { phone, email, name, password, role, gender, address } = req.body;
      // check user exist, check email, name, phone
      const existUser = await this.model.find({
        $or: [{ phone }, { email }],
      });
      if (!isEmpty(existUser)) {
        throw {
          statusCode: 400,
          message: "Đã tồn tại tài khoản",
        };
      }
      const currentTime = moment().unix();
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
      let result = await super.newCreate({
        name,
        phone,
        email,
        password,
        gender,
        role,
        image,
        address,
        updatedTime: currentTime,
        time: currentTime,
        status: userService.STATUS_WORKING,
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

  updateUserIn4 = async (req, res, next) => {
    try {
      if (!req.patient) {
        throw {
          statusCode: 404,
          message: "Không có quyền truy cập",
        };
      }
      const { name, phone, gender, address } = req.body;
      const { id } = req.patient;
      const currentTime = moment().unix();
      const formattedId = mongoose.Types.ObjectId(id);
      let user = await super.getEntry([
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
      user = !isEmpty(user) ? user[0] : null;
      if (!user) {
        throw {
          statusCode: 404,
          message: "Không tìm thấy tài khoản",
        };
      }
      const { phone: oldPhone } = user;
      if (phone != oldPhone) {
        const existUser = await this.model.find({
          phone: phone,
        });
        if (!isEmpty(existUser)) {
          throw {
            statusCode: 400,
            message: "Đã tồn tại số điện thoại",
          };
        }
      }
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
      let result = await super.update(id, {
        name,
        phone,
        gender,
        image,
        address,
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

  changePass = async (req, res, next) => {
    try {
      const { password, newPassword } = req.body;
      const { id } = req.params;
      const hashFn = hash.createHashPasswordFn(
        saltLength,
        iterations,
        keylength,
        digest
      );
      const user = await Users.findOne({ _id: id });
      const passHash = await hashFn(newPassword);
      const passIsValid = await hash.isPasswordCorrect(
        {
          hash: user.password,
          salt: user.salt,
          iterations,
          keylength,
          digest,
        },
        password
      );

      if (!passIsValid) {
        throw new Error({
          statusCode: 401,
          message: "Mật khẩu không đúng!",
        });
      } else {
        password = newPassword;
      }
      // pass
      const result = await super.update(id, {
        password: passHash.hash,
        salt: passHash.salt,
      });

      res.locals.resData = {
        statusCode: 200,
        message: "Đổi mật khẩu thành công",
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
      const currentTime = moment().unix();
      if (!req.admin) {
        throw {
          statusCode: 404,
          message: "Không có quyền truy cập",
        };
      }
      let result = await super.update(id, {
        status: userService.STATUS_DISABLED,
        updatedTime: currentTime,
      });
      res.locals.resData = {
        statusCode: 200,
        message: "Xóa tài khoản thành công",
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
