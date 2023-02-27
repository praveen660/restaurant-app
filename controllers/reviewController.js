const { users, reviews } = require("../Models");
const catchAsync = require("../Utils/catchAsync.js");
const AppError = require("../Utils/AppError");
const { Op } = require("sequelize");

//Create Reviews
exports.createReviews = catchAsync(async (req, res, next) => {
  let { ratings, description,restaurantId, ...rest } = req.body;
  let userId=req?.user?.id;
  console.log(req.body)
  if(!restaurantId) return next(new AppError("Please provide restaurant id",400))
  const data = { ratings, description,userId,restaurantId };

  const doc = await reviews.create(data);
  if (!doc) {
    return next(new AppError("unable to store data", 500));
  }
  res.status(201).send({ message: "success", data: doc });
});




exports.getAllReviews = catchAsync(async (req, res, next) => {
  let doc;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  doc = await reviews.findAndCountAll({
    include: [
      {
        model: users,
        as: "userInfo",
      },
    ],
    order: [["id", "DESC"]],
    offset: skip,
    limit: limit,
  });

  if (!doc) {
    return next(new AppError("Result not found", 404));
  }
  res.status(200).send({ message: "success", data: doc });
});


exports.deleteReviewsById = catchAsync(async (req, res, next) => {
  const doc = await reviews.destroy({
    where: { id: req.params.id },
  });
  if (doc === 0) {
    return next(
      new AppError("Unable to delete or No data found with this id", 404)
    );
  }
  res.status(200).send({ message: "success" });
});


