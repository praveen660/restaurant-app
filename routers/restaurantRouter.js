const express = require("express");
const {
  createRestaurants,
  updateRestaurants,
  getAllRestaurants,
  getRestaurantsById,
  deleteRestaurantsById,
  deleteMultipleRestaurants,
} = require("../controllers/restaurantController");

const router = express.Router();
router.route("/delete-multi").post(deleteMultipleRestaurants); 
router.route("/").post(createRestaurants).get(getAllRestaurants); 
router.route("/:id").get(getRestaurantsById).patch(getAllRestaurants).delete(deleteRestaurantsById); 
module.exports=router;
