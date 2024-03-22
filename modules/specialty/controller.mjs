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
  // //lấy toàn bộ specialty ra
  getListSpecialty = async (req, res, next) => {
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
      const aggregation = [
        {
          $match: objCondition,
        },
        {
          $project: {
            id: "$_id",
            name: 1,
            description: 1,
            image: 1,
            updatedTime: 1,
            time: 1,
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
            foreignField: "specialtyId",
            as: "doctorClinicSpecialty",
            pipeline: pipelineLookup,
          },
        });
        if (isDoctor) {
          const pipelineDoctor = [
            {
              $project: {
                id: "$_id",
                name: 1,
                image: 1,
                position: 1,
              },
            },
          ];
          pipelineLookup.push({
            $lookup: {
              from: "doctors",
              localField: "doctorId",
              foreignField: "_id",
              as: "doctors",
              pipeline: pipelineDoctor,
            },
          });
          if (isSchedule) {
            pipelineDoctor.push({
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
  //tìm specialty theo id
  getSpecialtyById = async (req, res, next) => {
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
            description: 1,
            image: 1,
            updatedTime: 1,
            time: 1,
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
            foreignField: "specialtyId",
            as: "doctorClinicSpecialty",
            pipeline: pipelineLookup,
          },
        });
        if (isDoctor) {
          const pipelineDoctor = [
            {
              $project: {
                id: "$_id",
                name: 1,
                image: 1,
                position: 1,
              },
            },
          ];
          pipelineLookup.push({
            $lookup: {
              from: "doctors",
              localField: "doctorId",
              foreignField: "_id",
              as: "doctors",
              pipeline: pipelineDoctor,
            },
          });
          if (isSchedule) {
            pipelineDoctor.push({
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
      if (isMarkdown) {
        aggregation.push({
          $lookup: {
            from: "markdowns",
            localField: "_id",
            foreignField: "specialtyId",
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

  create = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { name, description } = req.body;
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
        description,
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

  updateSpecialtyIn4 = async (req, res, next) => {
    try {
      if (!req.admin) {
        throw {
          statusCode: 400,
          message: "Không có quyền thao tác",
        };
      }
      const { name, description } = req.body;
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

export default new Ctrl(Specialties);
