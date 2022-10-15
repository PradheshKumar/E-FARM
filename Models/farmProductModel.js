const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const farmProductSchema = new mongoose.Schema(
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
    quantity: Number,
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
      ref: "FarmSeller",
    },
    type: { type: String, enum: ["seed", "tool", "tractor", "fertilizer"] },
    stockLeft: { type: Number, required: [true, "Enter Remaining Stock"] },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      city: String,
    },
    rent: {
      type: Boolean,
      default: false,
    },
    rentPrice: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// farmProductSchema.index({ price: 1 });
farmProductSchema.index({ price: 1, ratingsAverage: -1 });
farmProductSchema.index({ slug: 1 });
farmProductSchema.index({ location: "2dsphere" });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// farmProductSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE

farmProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "seller",
    select: "-__v -passwordChangedAt -role -photo",
  });

  next();
});

// farmProductSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// farmProductSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

module.exports =
  mongoose.models.FarmProduct ||
  mongoose.model("FarmProduct", farmProductSchema);
