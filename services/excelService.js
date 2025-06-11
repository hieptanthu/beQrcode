const xlsx = require("xlsx");

const readExcelFile = (filePath, startRow = 1) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  return data.slice(startRow);
};

const processDataAndInsertIntoDB = (data, codeColumn) => {
  return data.map((row) => {
    const code = row[codeColumn] || "No code"; // Default if no code
    let mergedInfo = "";
    Object.keys(row).forEach((key) => {
      if (key !== codeColumn) {
        mergedInfo += row[key] + " ";
      }
    });
    return {
      code: code,
      info: mergedInfo.trim(),
    };
  });
};

module.exports = {
  readExcelFile,
  processDataAndInsertIntoDB,
};
