function CheckVoltage(voltageCode) {
  switch (voltageCode) {
    case "B":
      return "3.2v";
    case "E":
      return "3.7v";
    default:
      return "null";
  }
}

module.exports = { CheckVoltage };
