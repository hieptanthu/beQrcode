const queryAsync = require("../services/databaseService").queryAsync;
const { CheckVoltage } = require("../check/CheckVoltage");
const { ChecktypePin } = require("../check/ChecktypePin");
const { CallNhaCCByCode } = require("../db/nhacc");
const { decodeBatteryCode } = require("../check/checkDate");


const getProductByCode = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).send("Product code is required.");
  }

  try {
    // Kiểm tra mã sản phẩm hợp lệ và tách các phần
    if (code.length < 5) {
      return res.status(400).send("Invalid product code format.");
    }

    const parts = code.split("");
    const brandCode = parts.slice(0, 3).join(""); // 3 ký tự đầu: mã nhà cung cấp
    const typeCode = parts[3]; // loại pin
    const voltageCode = parts[4]; // mã điện áp

    // Gọi hàm kiểm tra nhà cung cấp, nếu không tìm thấy thì trả lỗi
    const brand = await CallNhaCCByCode(brandCode);
    if (!brand) {
      return brand= null;
    }

    // Kiểm tra loại pin và điện áp
    const type = ChecktypePin(typeCode);
    const voltage = CheckVoltage(voltageCode);
    const date = decodeBatteryCode(code);

    const sql = `
      SELECT p.code, p.info AS product_info, cp.info AS content_info
      FROM products p
      JOIN content_product cp ON p.id_content_product = cp.id
      WHERE p.code = ?`;

    const result = await queryAsync(sql, [code]);

    const dataOut = {
      brand,
      type,
      voltage,
      date,
    };

    if (result.length > 0) {
      const productInfo = result[0].product_info || "";
      const contentInfo = result[0].content_info || "";

      const contentKeys = contentInfo.split("||");
      const productInfoArray = productInfo.split("||");

      const combinedInfo = {};
      contentKeys.forEach((key, index) => {
        combinedInfo[key] = productInfoArray[index] || null;
      });

      dataOut.contentKeys = contentKeys;
      dataOut.combined_info = combinedInfo;
    }

    res.status(200).json(dataOut);
  } catch (err) {
    console.error("Error fetching product by code:", err);
    res.status(500).send("Error fetching product by code.");
  }
};

module.exports = {
  getProducts,
  getProductByCode,
};
