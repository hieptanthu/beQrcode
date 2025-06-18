// Hàm giải mã ngày, tháng từ số hoặc ký tự
function decodeDateOrMonth(code) {
  const skippedChars = ['i', 'u', 'o', 'Q']; // Các ký tự cần bỏ qua
  const alphabet = 'ABCDEFGHJKLMNPRSTVWXYZ'; // Danh sách các ký tự từ A đến Z, bỏ qua i, u, o, Q
  
  // Kiểm tra nếu là số
  if (parseInt(code)) {
    return parseInt(code);
  } else {
    // Nếu là chữ cái (A, B, C...), tính giá trị từ 10 trở đi
    let index = alphabet.indexOf(code.toUpperCase());
    
    if (index !== -1) {
      // Tính toán giá trị tháng, bắt đầu từ 10
      let skippedCount = 0;

      // Bỏ qua các ký tự bị loại
      for (let i = 0; i < index; i++) {
        if (skippedChars.includes(alphabet[i].toLowerCase())) {
          skippedCount++;
        }
      }

      // Tính toán giá trị tháng, bắt đầu từ 10
      let month = 10 + (index - skippedCount);

      // Nếu tháng vượt quá 31, reset về 1
      if (month > 31) {
        month = 1;
      }

      return month;
    }
  }
  
  return -1; // Trả về giá trị lỗi nếu không phải ký tự hợp lệ
}

// Hàm giải mã năm từ ký tự
function decodeYear(yearCode) {
  const baseYear = 2010; // Năm bắt đầu từ 2010
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
  let day = decodeDateOrMonth(dayCode);
  let month = decodeDateOrMonth(monthCode);
  const productionYear = decodeYear(yearCode);

  // Nếu tháng là giá trị -1 (do gặp ký tự bị bỏ qua), ta xử lý lại
  if (month === -1) {
    return "Invalid month code due to skipped character";
  }

  // Điều chỉnh ngày nếu tháng vượt ra ngoài phạm vi
  if (month > 12) {
    month = 1; // Nếu tháng vượt quá 12 thì reset lại tháng thành 1
    day = 1; // Cập nhật ngày thành 1
  } else if (month < 1) {
    month = 12; // Nếu tháng nhỏ hơn 1 thì reset lại tháng thành 12
    day = 1; // Cập nhật ngày thành 1
  }

  return day + "/" + month + "/" + productionYear;
}

module.exports = { decodeBatteryCode };
