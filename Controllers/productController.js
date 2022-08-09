const Seller = require("../Models/sellerModel");
const Product = require("../Models/productModel");
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
exports.uploadImages = (req, res, next) => {
  const imgNames = fs.readdirSync(req.filePath);
  // cp.copy(img.toString("base64"));
  const imgId = imgNames.map((img) => {
    const image = fs.readFileSync(path.join(req.filePath, img));
    // cp.copy(image.toString("base64"));
  });
  res.status(201).json({
    status: "success",
    data: {},
  });
  // next();
};
const multerStorage = multer.memoryStorage();

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `tour-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/products/${filename}`);
      req.filePath = path.join(__dirname, `../public/img/products/`);
      // req.body.images.push(filename);
    })
  );

  next();
});
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
