const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const buyerRouter = require("./Routes/buyerRoutes");
const negotiationRouter = require("./Routes/negotiationRoutes");
const orderRouter = require("./Routes/orderRoutes");
const farmOrderRouter = require("./Routes/farmOrderRoutes");
const productRouter = require("./Routes/productRoutes");
const farmProductRouter = require("./Routes/farmProductRoutes");
const sellerRouter = require("./Routes/sellerRoutes");
const farmSellerRouter = require("./Routes/farmSellerRoutes");
const viewRouter = require("./Routes/viewRoutes");
const rentRouter = require("./Routes/rentRoutes");
const demandRouter = require("./Routes/demandRoutes");

// Start express app
const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// 1) GLOBAL MIDDLEWARES
// Implement m
app.use(cors());
// Access-Control-Allow-Origin *
app.options("*", cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", "data:", "blob:"],

//       fontSrc: ["'self'", "https:", "data:"],

//       scriptSrc: ["'self'", "unsafe-inline"],

//       scriptSrc: ["'self'", "https://*.cloudflare.com"],

//       scriptSrcElem: ["'self'", "https:", "https://*.cloudflare.com"],

//       styleSrc: ["'self'", "https:", "unsafe-inline"],

//       connectSrc: [
//         "'self'",
//         "data",
//         "https://*.cloudflare.com",
//         "http://127.0.0.1:3000",
//         "ws://127.0.0.1:55413/",
//         "ws://127.0.0.1:62560/",
//         "ws://127.0.0.1:62713/",
//         "ws://127.0.0.1:61040/",
//         "ws://127.0.0.1:58760/",
//         "ws://127.0.0.1:64454/",
//         "ws://127.0.0.1:60432/",
//         "ws://127.0.0.1:64959/",
//         "https://js.stripe.com/v3/",
//         "https://checkout.stripe.com/*",
//       ],
//     },
//   })
// );
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/buyer", buyerRouter);
app.use("/api/v1/user", buyerRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/farmSeller", farmSellerRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/rent", rentRouter);
app.use("/api/v1/farmOrder", farmOrderRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/farmProduct", farmProductRouter);
app.use("/api/v1/negotiation", negotiationRouter);
app.use("/api/v1/demand", demandRouter);

const ondc = require("ondc-node");
const handlers = require("./handlers");
app.use(express.json());
// ONDC Middleware
app.use(
  "/ondc",
  ondc.Middleware({
    on_search: handlers["onSearch"],
    on_init: handlers["onInit"],
  })
);
app.all("*", (req, res, next) => {console.log(33)
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
