// Import required modules
import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import AccountAdminloginrouter from './routes/AccountLogin.route.js';
import AccountAdminrouter from "./routes/AccountRegisterAdmin.route.js";
import Inquirysection from "./routes/Inquiry.route.js";
import Requestservices from "./routes/Requestservices.route.js";
import Slidersection from "./routes/Slidersection.route.js";
import CourseSection from "./routes/Couressection.route.js";
import OttserviceSection from "./routes/Ottservice.route.js";
import OrderserviceSection from "./routes/Order.route.js";

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
      "https://buycourse-lk-umlb.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//ADMIN -> MIDDLEWARE -> SERVER
app.use('/Adminlogin', AccountAdminloginrouter);
app.use('/Adminregister',AccountAdminrouter);
app.use('/Inquiry',Inquirysection);
app.use('/Requestservices',Requestservices);
app.use('/Slidersection',Slidersection);
app.use('/Couressection',CourseSection);
app.use('/Ottservice',OttserviceSection);
app.use('/Odder',OrderserviceSection);



// Start server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
