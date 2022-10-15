const Seller = require("../Models/farmSellerModel");
const Product = require("../Models/farmProductModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.searchProduct = catchAsync(async (req, res, next) => {
  const data = await Product.find({
    name: { $regex: new RegExp(req.params.key, "i") },
  });
  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});
// Do NOT update passwords with this!
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadImages = upload.array("images", 3);

exports.resizeImage = catchAsync(async (req, res, next) => {
  // if (!req.files) return next();
  if (req.files) {
    req.body.images = [];
    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `Product-${Date.now()}-${i + 1}.jpg`;

        await sharp(file.buffer)
          .resize(370, 370)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`public/img/${filename}`);
        req.filePath = path.join(__dirname, `../public/img/`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});

exports.addProduct = factory.createOne(Product);
exports.addLocation = catchAsync(async (req, res, next) => {
  req.body.location = res.locals.user.location;
  req.body.seller = res.locals.user.id;

  next();
});
exports.addProductSeller = catchAsync(async (req, res, next) => {
  const seller = await Seller.findById(res.locals.user.id);
  if (seller.productSold)
    await Seller.findByIdAndUpdate(res.locals.user.id, {
      productSold: seller.productSold + 1,
    });
  else
    await Seller.findByIdAndUpdate(res.locals.user.id, {
      productSold: 1,
    });

  next();
});

exports.getProductsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }

  const products = await Product.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      data: products,
    },
  });
});
exports.getImages = upload.array("images", 5);
