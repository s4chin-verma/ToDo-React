const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const taskRoute = require("./routes/taskRoutes");
const verifyToken = require("./middleware/verifyToken");

dotenv.config();

const app = express();

const corsOptions = {
  origin: [process.env.DEVELOPMENT_URL, process.env.PRODUCTION_URL],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/route", verifyToken, taskRoute);

app.get("/", (req, res) => {
  res.json({
    message: `Welcome to the Todo List API. This server powers the backend of the Todo List application, handling data and logic. For a stylish and interactive frontend, please visit the corresponding Todo List frontend application. ${process.env.PRODUCTION_URL}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = server;
