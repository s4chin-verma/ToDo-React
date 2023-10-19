const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const taskRoute = require("./routes/taskRoutes");
const verifyToken = require("./middleware/verifyToken");

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute);

app.use("/api/route", verifyToken, taskRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  } else {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error occurred while connecting to MongoDB", error);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
