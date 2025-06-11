// Hàm giải mã ngày, tháng từ số hoặc ký tự
function decodeDateOrMonth(code) {
  if (parseInt(code)) {
    // Nếu là số 1-9, trả về trực tiếp
    return parseInt(code);
  } else {
    // Nếu là chữ cái (A, B, C...), tính giá trị từ 10 trở đi
    const base = "A".charCodeAt(0) - 10; // A = 10, B = 11, ...
    return code.charCodeAt(0) - base;
  }
}

// Hàm giải mã năm từ ký tự
function decodeYear(yearCode) {
  const baseYear = 2010; // Năm bắt đầu từ 20010
  const letterCode = yearCode.toUpperCase(); // Chuyển thành chữ hoa

  // Tính toán năm dựa trên mã ký tự
  const year = baseYear + letterCode.charCodeAt(0) - "A".charCodeAt(0) + 10;

  return year;
}

// Hàm giải mã toàn bộ mã QR
function decodeBatteryCode(code) {
  // Tách mã sản phẩm thành các phần
  const parts = code.split("");

  if (parts.length !== 24) {
    throw new Error("Định dạng mã không hợp lệ");
  }

  const dayCode = parts[16];
  const monthCode = parts[15];
  const yearCode = parts[14];

  // Giải mã ngày, tháng và năm
  const day = decodeDateOrMonth(dayCode);
  const month = decodeDateOrMonth(monthCode);
  const productionYear = decodeYear(yearCode);

  return day + "/" + month + "/" + productionYear;
}
module.exports = { decodeBatteryCode };
