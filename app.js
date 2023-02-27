const express = require("express");
const app = express();
const xss = require("xss-clean");
const dotenv = require("dotenv");
const db = require("./models");
const cors = require("cors");
const AppError=require("./utils/AppError")
const userRouter=require('./routers/userRouter')
const restaurantRouter=require('./routers/restaurantRouter')
const reviewRouter=require('./routers/reviewRouter')
const globalErrorHandler=require('./controllers/ErrorHandleController')
app.use(xss());
app.use(cors());

// Body Parser, reading data from body into req.body
app.use(express.json({}));
// app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))

dotenv.config({ path: "./config.env" });
// app.use(express.static(`${__dirname}/public`));

// 2) ROUTES

app.use("/api/v1/user", userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/review", reviewRouter);


const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`app is running on the Port ${port}`);
});

// 3)ERROR HANDLING
app.all("*", (req, res, next) => {
  // res
  //   .status(404)
  //   .json({ error: `Can't find ${req.originalUrl} on this server` });
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
// app.use((err,req,res,next)=>{
// console.log(err)
// return;
// })

module.exports = app;
