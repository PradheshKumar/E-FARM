const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Product must have a name"],
      trim: true,
      maxlength: [
        20,
        "A Product name must have less or equal then 20 characters",
      ],
      minlength: [
        3,
        "A Product name must have more or equal then 3 characters",
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Product must have a price"],
    },
    costPer: String,
    // priceDiscount: {
    //   type: Number,
    //   validate: {
    //     validator: function (val) {
    //       // this only points to current doc on NEW document creation
    //       return val < this.price;
    //     },
    //     message: 'Discount price ({VALUE}) should be below regular price',
    //   },
    // },
    summary: {
      type: String,
      trim: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "Seller",
    },
    type: String,
    stockLeft: { type: Number, required: [true, "Enter Remaining Stock"] },
    img: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

// Virtual populate
// productSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'product',
//   localField: '_id',
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "seller",
    select: "-__v -passwordChangedAt -role -photo -email",
  });

  next();
});

// productSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// productSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
