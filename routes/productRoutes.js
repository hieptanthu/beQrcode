const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:code", productController.getProductByCode);
module.exports = router;
