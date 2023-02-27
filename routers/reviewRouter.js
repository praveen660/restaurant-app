const express = require("express");
const {createReviews,getAllReviews,deleteReviewsById
 
} = require("../controllers/reviewController");
const {protect,restrictTo}=require('../controllers/authController')

const router = express.Router();
router.route("/").post(protect,createReviews).get(getAllReviews); 
router.route("/:id").delete(deleteReviewsById); 
module.exports=router;
