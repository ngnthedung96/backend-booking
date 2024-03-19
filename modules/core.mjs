/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
/**
 * Author khiemtv
 *
 */

export default class CoreCtrl {
  constructor(model) {
    this.model = model;
  }

  _getList(options, query) {
    const myAggregate = query
      ? this.model.aggregate(query)
      : this.model.aggregate();
    return this.model.aggregatePaginate(myAggregate, options);
  }

  create(data) {
    const obj = new this.model(data);
    const err = obj.validateSync();
    let result;
    if (!err) {
      result = obj.save();
    }

    return err || result;
  }

  async createMany(data) {
    const result = await this.model.insertMany(data);
    console.log("Create Many result: ", result);
    return result;
  }

  async update(id, data) {
    try {
      const obj = await this.model.findById(id);
      if (!obj) {
        throw {
          statusCode: 404,
          message: `Object not found for _id: ${id}`,
        };
      }

      obj.set(data);
      const result = await obj.save();
      console.log("Update result: ", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    const result = await this.model.findByIdAndDelete(id);
    return result;
  }
  async getPagination(aggregateOpt, options) {
    const myAggregate = aggregateOpt
      ? this.model.aggregate(aggregateOpt)
      : this.model.aggregate();
    let result = await this.model.aggregatePaginate(myAggregate, options);
    return result;
  }
  async getObj(objCondition) {
    let result = await this.model.findOne(objCondition);
    return result;
  }
  async getEntry(aggregateOpt) {
    let result = await this.model.aggregate(aggregateOpt);
    return result;
  }
  async newCreate(data) {
    const result = this.model.create(data);
    return result;
  }
  async newUpdate(data, filter) {
    const result = await this.model.updateOne(filter, data);
    return result;
  }
}
