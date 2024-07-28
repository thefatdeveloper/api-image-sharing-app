const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
dotenv.config();

// Import Routes (Uncomment these lines when you have the routes defined)
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

// Connect to MongoDB (Promise-based approach)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Now you can start your server safely after the connection is established
    startServer();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    // Handle connection error gracefully (e.g., exit the process)
    process.exit(1);
  });

// Function to start the server after MongoDB connection is successful
function startServer() {
  // Middleware
  app.use("/images", express.static(path.join(__dirname, "public/images")));
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
  app.use(
    cors({
      origin: "*",
    })
  );
  // Mount Routes to paths (Uncomment these lines when you have the routes defined)
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/posts", postRoute);

  // Multer Setup (For image uploads)
  const imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

  const upload = multer({ storage: imgStorage });

  // Routes
  app.get("/", (req, res) => {
    res.send("Hello CodeSandbox! Srikar");
  });

  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploaded!!!");
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json("File upload failed.");
    }
  });

  // Start the server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(path.join(__dirname, "public/images"));
  });
}
