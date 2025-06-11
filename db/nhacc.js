const queryAsync = require("../services/databaseService").queryAsync;
const CallNhaCCByCode = async (code) => {
  const sqlNhacc = `
      SELECT p.name
      FROM nhaCC p
      WHERE p.code = ?`;

  try {
    const result = await queryAsync(sqlNhacc, [code]);

    if (result.length > 0) {
      const manufacturer = result[0].name;
      return manufacturer;
    } else {
      return "null";
    }
  } catch (err) {
    console.error("Lỗi khi truy vấn nhà cung cấp:", err);
    throw new Error("Lỗi khi truy vấn nhà cung cấp");
  }
};

module.exports = { CallNhaCCByCode };
