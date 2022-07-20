class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    // console.log(this);
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const exclude = ['page', 'sort', 'limit', 'fields'];

    exclude.forEach((el) => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(lte|lt|gt|gte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      const field = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else this.query = this.query.select('-__v');
    return this;
  }
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    /////////////////////////////////////////////
    return this;
  }
}
module.exports = APIFeatures;
