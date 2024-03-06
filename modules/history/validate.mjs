import {check, body, param} from 'express-validator';
import mongoose from 'mongoose';
import Permissions from './model.mjs'
const validate = (method) => {
    let err = [];
    switch (method) {
        //CASE CREATE
        case 'create':        {
            err = [
              body("name", "Name khong hop le")
              //body("phone", "Phone khong hop le")
                .notEmpty()
                .custom((value) => {
                  return Permissions.findOne({ name: value })
                    .exec()
                    .then((obj) => {
                      if (obj) {
                        return Promise.reject("name already in use");
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
    
        //CASE UPDATE
        case 'update' : {
            err= [
                body('name', 'name không được để trống').notEmpty(),
                param('id', 'Id không hợp lệ').custom((value) => {
                    if(mongoose.Types.ObjectId.isValid(value)) {
                        return Permissions.findById(value)
                        .exec()
                        .then((obj) => {
                            if(!obj) {
                                return Promise.reject("object not found")
                            }
                        });
                    }
                    else {
                        throw new Error(
                            "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
                        );
                    }
                }),
            ];
        }
        break;
        //CASE DELETE
        case 'delete': {
            err = [
                param('id', 'Id không hợp lệ').custom((value) => {
                    if(mongoose.Types.ObjectId.isValid(value)){
                        return Permissions.findById(value)
                        .exec()
                        .then((obj) => {
                            if(!obj) {
                                return Promise.reject('object not found')
                            }
                        });
                    } 
                    else {
                        throw new Error(
                            'Id must be a string of 12 bytes or a string of 24 hex characters or an integer'
                        )
                    }
                })
            ]
        }
        break;
        //CASE CHECK ID 
        case 'checkId' : {
            err = [
                param('id', 'Id không hợp lệ').custom((value) => {
                    if(mongoose.Types.ObjectId.isValid(value)){
                        return Permissions.findById(value)
                        .exec()
                        .then((obj) => {
                            if(!obj) {
                                return Promise.reject('không tồn tại Permissions có Id như trên')
                            }
                        });
                    }
                    else {
                        throw new Error (
                            'Id Permissions không tồn tại'
                        )
                    }
                })
            ]
        }
        break;
        case 'search' : {
            err = [ 
                param('data', 'Du lieu nhap khong hop le').notEmpty()
            ]   
        }
        break;

    }

    return err;
}

export default validate;