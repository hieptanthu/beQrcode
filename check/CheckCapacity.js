function CheckCapacity(code) {
  switch (typeCode) {
    case "C":
      return "Cell (Pin đơn lẻ)";
    case "P":
      return "Pack (Pin hoàn thiện pack)";
    case "M":
      return "Module (Pin lưu trữ dự án)";
    default:
      throw new Error("Loại sản phẩm không hợp lệ");
  }
}
module.exports = { CheckCapacity };
