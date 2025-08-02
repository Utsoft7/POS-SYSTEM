const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const PORT = config.port;
connectDB();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://c74b9d0d9ec4.ngrok-free.app"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello from POS-SYSTEM Server!" });
});

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler
app.use(globalErrorHandler);

// Server
app.listen(PORT, () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    `>>>  POS Server is listening on port ${PORT}`
  );
});
