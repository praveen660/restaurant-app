const { restaurants, reviews } = require("../Models");
const catchAsync = require("../Utils/catchAsync.js");
const AppError = require("../Utils/AppError");
const { Op } = require("sequelize");
// const {sequelize}=require("../models/index")

//Create Restaurants
exports.createRestaurants = catchAsync(async (req, res, next) => {
  let { name, description, address,userId, ...rest } = req.body;
  const data = { name, description, address,userId };
  console.log(data)

  const doc = await restaurants.create(data);
  if (!doc) {
    return next(new AppError("unable to store data", 500));
  }
  res.status(201).send({ message: "success", data: doc });
});

//Update Restaurants
exports.updateRestaurants = catchAsync(async (req, res, next) => {
  const id = req?.params?.id;
  let { name, description, address,userId, ...rest } = req.body;
  const data = { name, description, address,userId };
  if (!id) return next(new AppError("Please provide Id of restaurant", 400));

  const doc = await restaurants.update(data, { where: { id: id } });

  if (doc[0] === 0) {
    return next(
      new AppError("Unable to update data!. Please check fields or id!", 404)
    );
  }
  res.status(200).send({ message: "Data updated successfully" });
});

//Get all Restaurants
exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  let doc;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  doc = await restaurants.findAndCountAll({
    attributes: ["id", "name", "description", "createdAt", "updatedAt"],
    include: [
      {
        model: reviews,
        // attributes: ['id', [sequelize.fn('COUNT', sequelize.col('ratings')), 'description']],
        as: "reviews",
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

//Get Restaurants by Id
exports.getRestaurantsById = catchAsync(async (req, res, next) => {
  let doc;
  doc = await restaurants.findOne({
    attributes: ["id", "name", "description", "createdAt", "updatedAt"],
    include: [
      {
        model: reviews,
        as: "reviews",
      },
    ],
    where: { id: req?.params?.id },
  });
  if (!doc) {
    return next(new AppError("Data not found with this Id", 404));
  }
  res.status(200).send({ message: "success", data: doc });
});

//Delete Restaurants
exports.deleteRestaurantsById = catchAsync(async (req, res, next) => {
  const doc = await restaurants.destroy({
    where: { id: req.params.id },
  });
  if (doc === 0) {
    return next(
      new AppError("Unable to delete or No data found with this id", 404)
    );
  }
  res.status(200).send({ message: "success" });
});

//DElete multiple content
exports.deleteMultipleRestaurants = catchAsync(async (req, res, next) => {
  let doc;
  if (
    !req.body.id ||
    Array.isArray(req.body.id) === false ||
    !req.body.id.length
  ) {
    return next(
      new AppError(
        "Please provide Id and id should be array also array should not be empty ",
        400
      )
    );
  }
  await Promise.all(
    req?.body?.id.map(async (el) => {
      doc = await restaurants.destroy({
        where: { id: el },
      });
    })
  );
  if (doc === 0) {
    return next(
      new AppError("Unable to delete or No data found with this id", 404)
    );
  }
  res.status(200).send({ message: "success" });
});
