const queryAsync = require("../services/databaseService").queryAsync;
const { CheckVoltage } = require("../check/CheckVoltage");
const { ChecktypePin } = require("../check/ChecktypePin");
const { CallNhaCCByCode } = require("../db/nhacc");
const { decodeBatteryCode } = require("../check/checkDate");
const getProducts = async (req, res) => {
  const sql = "SELECT * FROM products";
  try {
    const results = await queryAsync(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).send("Error retrieving products.");
  }
};

const getProductByCode = async (req, res) => {
  const { code } = req.params; // Using params for code in the URL

  if (!code) {
    return res.status(400).send("Product code is required.");
  }
  const parts = code.split("");

  // Giải mã các phần của mã QR
  const brandCode = parts.slice(0, 3).join(""); // 3 ký tự đầu tiên: Thương hiệu
  const typeCode = parts[3]; // Ký tự thứ 4: Loại pin (C, P, M)
  const voltageCode = parts[4]; // Ký tự thứ 5: Điện áp (B hoặc E)
  dataOut = {
    brand: await CallNhaCCByCode(brandCode),
    type: ChecktypePin(typeCode),
    voltage: CheckVoltage(voltageCode),
    date: decodeBatteryCode(code),
  };

  const sql = `
    SELECT p.code, p.info AS product_info, cp.info AS content_info
    FROM products p
    JOIN content_product cp ON p.id_content_product = cp.id
    WHERE p.code = ?`;

  try {
    const result = await queryAsync(sql, [code]);

    if (result.length > 0) {
      const productInfo = result[0].product_info; // Product info from the products table
      const contentInfo = result[0].content_info; // Content info from content_product

      // Optional: Split and process contentInfo if needed
      const contentKeys = contentInfo.split(" "); // Assuming content_info contains keys split by spaces
      const productInfoArray = productInfo.split(" ");

      let combinedInfo = {};

      contentKeys.forEach((key, index) => {
        combinedInfo[key] = productInfoArray[index] || null;
      });
      dataOut.combined_info = combinedInfo; // This is a merged object containing the information
    }
    res.status(200).json(dataOut);
  } catch (err) {
    console.error("Error fetching product by code:", err);
    res.status(500).send("Error fetching product by code.");
  }
};

module.exports = {
  getProducts,
  getProductByCode, // Add the new function here
};
