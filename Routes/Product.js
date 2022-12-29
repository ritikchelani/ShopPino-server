const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getsingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../Controllers/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");


router.route("/products").get(getProducts);


router.route("/product/:id").get(getsingleProduct);


router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

  router.route("/review").put(isAuthenticatedUser, createProductReview);

  router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

  router.route("/reviews").delete(isAuthenticatedUser, deleteReview);


  module.exports = router;
