const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const examRoutes = require("./routes/exams");
const questionRoutes = require("./routes/questions");
const resultRoutes = require("./routes/results");
const AppError = require("./utils/AppError");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// app.use(cors({ origin: "http://localhost:4200" }));
app.use(cors({ origin: [
  "https://exam-system-production-92be.up.railway.app/api",
  "http://localhost:4200",
]
// ] ,
//   credentials:true
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/result", resultRoutes);

mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      });
      })
  // .then(() => {
  //   app.listen(PORT, () =>
  //     console.log(`Server running on http://localhost:${PORT}`)
  //   );
  // })
  .catch((error) => {
    console.log(error);
  });

// Custom 404 Middleware
app.use((req, res, next) => {
  next(new AppError(404, "Route not found"));
  // res.status(404).json({ status: "fail", message: "Route not found" });
});

//error handling
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ status: "fail", message: err.message, stack: err.stack });
  } else if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ status: "fail", message: err.message, stack: err.stack });
  } else if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ status: "fail", message: err.message, stack: err.stack });
  } else if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ status: "fail", message: err.message, stack: err.stack });
  }
  res.status(err.statusCode || 500).json({
    status: "failed",
    message: err.message,
    stack: err.stack || "try again later",
  });
});
