const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const excelRoutes = require("./routes/excelRoutes");

const app = express();

const corsOptions = {
  origin: ["*", "http://localhost"], // Allow requests from this origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/upload-excel", excelRoutes);

// Run server
const PORT = process.env.PORT || 31000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
