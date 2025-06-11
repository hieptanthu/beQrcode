const multer = require("multer");
const path = require("path");
const {
  readExcelFile,
  processDataAndInsertIntoDB,
} = require("../services/excelService");
const queryAsync = require("../services/databaseService").queryAsync;

// Multer file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define the upload function
const uploadExcel = async (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  const { startRow, codeColumn } = req.body;

  const startRowIndex = startRow ? parseInt(startRow) - 1 : 0;

  try {
    const data = readExcelFile(filePath, startRowIndex);
    const processedData = processDataAndInsertIntoDB(data, codeColumn);

    // Insert into content_product
    const firstRowInfo = processedData[0].info;
    const sqlContentProduct = "INSERT INTO content_product (info) VALUES (?)";
    const resultContentProduct = await queryAsync(sqlContentProduct, [
      firstRowInfo,
    ]);
    const idContentProduct = resultContentProduct.insertId;

    // Insert into products
    const productsData = processedData
      .slice(1)
      .map((row) => [row.code, row.info, idContentProduct]);

    const sqlProducts =
      "INSERT INTO products (code, info, id_content_product) VALUES ?";
    await queryAsync(sqlProducts, [productsData]);

    res.status(200).send("Data has been uploaded and saved to the database.");
  } catch (err) {
    console.error("Error processing the Excel file:", err);
    res.status(500).send("Error processing the Excel file.");
  }
};

// Export uploadExcel and upload
module.exports = {
  uploadExcel,
  upload, // Make sure to export the upload middleware
};
