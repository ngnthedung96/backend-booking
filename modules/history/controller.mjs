import Permisions from './model.mjs';
import CoreCtrl from '../core.mjs';
// import e from 'express'

class Ctrl extends CoreCtrl {
  constructor(model) {
    super(model);
  }

  // hàm này thực hiện lấy ra toàn bộ list Permissions
  getList = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await super._getList({
        page, limit,
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

  // hàm thực hiện việc thêm mới Permissions
  create = async (req, res, next) => {
    try {
      let { name, status } = req.body;
      console.log(name, status);
      if (!status) { status = false; }
      console.log(status);
      const result = await super.create({ name, status });

      res.locals.resData = {
        statusCode: 200,
        message: 'Success',
        data: result,
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { name, status } = req.body;
      const { id } = req.params;
      const result = await super.update(id, { name, status });
      res.locals.resData = {
        statusCode: 200,
        message: 'success',
        data: result,
      };
      next();
    } catch (error) {
      next(error);
    }
  };

  // hàm thực hiện xóa Permissions
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await super.delete(id);
      res.locals.resData = {
        statusCode: 200,
        message: 'success',
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

  // hàm tìm kiếm Permissions
  getPermissionsById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Permisions.findById(id);
      res.locals.resData = {
        statusCode: 200,
        message: 'success',
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

  // hàm thực hiện tìm kiếm Permissions
  searchPermision = async (req, res, next) => {
    console.log('chạy vào đây chưa');
    try {
      const { data } = req.params;
      console.log('đây là data', data);
      console.log('check', typeof data);
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.page) || 10;
      const skip = (page - 1) * limit;
      const result = await this.model.find({
      // dùng $or để tìm trường name trong db và sẽ trả lại kết quả tương ứng
      // $option i dùng để tìm kết quả kể cả khi nhập chữ thường vẫn tìm được
        $or: [
          { name: { $regex: data, $options: 'i' } },
        ],
      })
        .skip(skip)
        .limit(limit);
      const totalPage = await this.model.aggregate([
      // dùng $match : chọn document mong muốn truy vấn tìm kết quả
        {
          $match: {
            $or: [
              { name: { $regex: data, $options: 'i' } },
            ],
          },
        },
        // dùng $group: nhóm các document thành 1 bảng
        {
          $group: {
            _id: '$state',
            count: { $sum: 1 },
          },
        },
      ]);

      //  console.log("totalPage", totalPage);
      // console.log("đã chạy đến đây chưa");
      res.locals.resData = {
        statusCode: 200,
        data: {
          totalPage: totalPage[0].count,
          docs: result.map((obj) => ({
            id: obj._id,
            name: obj.name,
          })),
        },
      };
      next();
    } catch (error) {
      // console.log("ngáo");
      next(error);
    }
  };

  // hàm thực hiện tìm kiếm theo permision
  search = async (req, res, next) => {
    console.log('chạy vào đây chưa');
    try {
      const { data } = req.params;
      console.log('đây là data', data);
      console.log('check', typeof data);
      const page = parseInt(req.query.page) || 1;
      console.log('page', page);

      const limit = parseInt(req.query.limit) || 10;
      console.log('limit', limit);
      const skip = (page - 1) * limit;

      const query = [{
        $match: {
          $or: [
            { name: { $regex: data, $options: 'i' } },
          ],
        },
      }];

      const results = await super._search(query, { page, limit });

      res.locals.resData = {
        statusCode: 200,
        data: {
          total: results.total,
          pages: results.pages,
          docs: results.docs.map((obj) => ({
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
}

export default new Ctrl(Permisions);
