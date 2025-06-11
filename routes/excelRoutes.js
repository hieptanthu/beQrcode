const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excelController");

// Use the upload middleware and then call the uploadExcel function
router.post(
  "/",
  excelController.upload.single("file"),
  excelController.uploadExcel
);

module.exports = router;
