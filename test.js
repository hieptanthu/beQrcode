function decodeBatteryCode(code) {
  // Tách mã sản phẩm thành các phần
  const parts = code.split("");

  // Kiểm tra độ dài mã, mã phải có 24 ký tự
  if (parts.length !== 24) {
    throw new Error("Định dạng mã không hợp lệ");
  }

  // Giải mã các phần của mã QR
  const brandCode = parts.slice(0, 3).join(""); // 3 ký tự đầu tiên: Thương hiệu
  const typeCode = parts[3]; // Ký tự thứ 4: Loại pin (C, P, M)
  const voltageCode = parts[4]; // Ký tự thứ 5: Điện áp (B hoặc E)
  const modelCode = parts.slice(5, 7).join(""); // Ký tự thứ 6-7: Model pin (Dung lượng)

  // Đối chiếu thương hiệu
  let manufacturer = "";
  switch (brandCode) {
    case "04Q":
      manufacturer = "EVE";
      break;
    case "0HB":
      manufacturer = "Battero Tech";
      break;
    case "02D":
      manufacturer = "JD";
      break;
    case "081":
      manufacturer = "REPT";
      break;
    case "00P":
      manufacturer = "SunWoDa";
      break;
    default:
      manufacturer = "Unknown";
  }

  // Đối chiếu loại pin
  let productType = "";
  if (typeCode === "C") {
    productType = "Cell (Pin đơn lẻ)";
  } else if (typeCode === "P") {
    productType = "Pack (Pin hoàn thiện pack)";
  } else if (typeCode === "M") {
    productType = "Module (Pin lưu trữ dự án)";
  } else {
    throw new Error("Loại sản phẩm không hợp lệ");
  }

  // Đối chiếu điện áp
  let voltage = "";
  if (voltageCode === "B") {
    voltage = "3.2V";
  } else if (voltageCode === "E") {
    voltage = "3.7V";
  } else {
    throw new Error("Điện áp không hợp lệ");
  }

  // Dung lượng pin (model code)
  let capacity = "";
  switch (modelCode) {
    case "C02":
      capacity = "280Ah";
      break;
    case "C03":
      capacity = "314Ah";
      break;
    case "C05":
      capacity = "350Ah";
      break;
    default:
      capacity = "Unknown capacity";
  }

  // Trích xuất thông tin sản phẩm
  const batteryDetails = {
    manufacturer: manufacturer, // Nhà sản xuất
    productType: productType, // Loại sản phẩm
    batteryType: "LiFePO4", // Loại pin
    nominalVoltage: voltage, // Điện áp
    nominalCapacity: capacity, // Dung lượng pin
    productionDate: "TBD", // Ngày sản xuất (chưa xác định)
    manufacturerWebsite:
      manufacturer === "EVE" ? "https://www.evebattery.com" : "Unknown", // Website nhà sản xuất
    fullCode: code, // Mã QR đầy đủ
  };

  return batteryDetails;
}

// Ví dụ sử dụng
const code = "04QCB76830200JD2A0005567"; // Mã QR của pin LiFePO4
try {
  const decodedInfo = decodeBatteryCode(code);
  console.log(decodedInfo);
} catch (error) {
  console.error(error.message); // In ra thông báo lỗi chi tiết
}
