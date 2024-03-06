import { check, body, param } from "express-validator";
import Users from "./model.mjs";
import mongoose from "mongoose";

const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
      {
        err = [
          body("name", "Name khong hop le").notEmpty(),
          body("phone", "Phone khong hop le")
            .notEmpty()
            .custom((value) => {
              return Users.findOne({ phone: value })
                .exec()
                .then((obj) => {
                  if (obj) {
                    return Promise.reject("Phone already in use");
                  }
                });
            }),
          /*body('role', 'Role khong hop le').notEmpty().custom(value => {
                    if(mongoose.Types.ObjectId.isValid(value)) {
                        return roleModel.findById(value).exec().then(obj => {
                            if (!obj) {
                                return Promise.reject('Role Object not found');
                            }
                        });
                    }
                    else {
                        throw new Error('Id must be a string of 12 bytes or a string of 24 hex characters or an integer');
                    }
                })*/
        ];
      }
      break;

    case "update":
      {
        err = [
          body("name", "Name khong hop le").notEmpty(),
          body("phone", "phone khong hop le").notEmpty(),
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Object not found");
                  }
                });
            } else {
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;

    case "delete":
      {
        err = [
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Object not found");
                  }
                });
            } else {
              console.log("vao day ma");
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;
    case "change":
      {
        err = [
          body("name", "Name khong hop le").notEmpty(),
          body("password", "password khong hop le").notEmpty(),
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Object not found");
                  }
                });
            } else {
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;
    //search
    case "search":
      {
        err = [param("keysearch", "thông tin đầu vào chưa đúng").notEmpty()];
      }
      break;
    case "checkId":
      {
        err = [
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tồn tại user có id như trên");
                  }
                });
            } else {
              throw new Error("Id user không tồn tại");
            }
          }),
        ];
      }
      break;
  }

  return err;
};

export default validate;
