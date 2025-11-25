// Import required modules
import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import inquirysection from "./routes/inquiry.route.js";
import requestservices from "./routes/requestservices.router.js";
import AccountAdminloginrouter from './routes/AccountLogin.route.js';
import AccountAdminrouter from "./routes/AccountRegisterAdmin.route.js";

// Create an instance of Express
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Connect DB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//ADMIN -> MIDDLEWARE -> SERVER
app.use('/inquiry',inquirysection);
app.use('/requestservices',requestservices);
app.use('/Adminlogin', AccountAdminloginrouter);
app.use('/Adminregister',AccountAdminrouter);


// Start server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
