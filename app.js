const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const excelRoutes = require("./routes/excelRoutes");
require('dotenv').config();

const app = express();


app.use(express.json());

const corsOptions = {
  origin: ["163.61.110.234"], 
  optionsSuccessStatus: 200, 
};
app.use(cors(corsOptions));

// Routes
app.use("/products", productRoutes);
app.use("/upload-excel", excelRoutes);

// Run server
const PORT = process.env.PORT || 31000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
