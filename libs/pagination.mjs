export default class Pagination {
  constructor(model) {
    this.model = model;
  }

  paginatedResults() {
    return async (req, res, next) => {
      const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
      const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 5;
      const skipIndex = (page - 1) * limit;
      const results = {};

      try {
        results = await this.model.find()
          .sort({ _id: 1 })
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}
