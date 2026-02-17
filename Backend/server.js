import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route Imports
import AccountAdminloginrouter from './routes/AccountLogin.route.js';
import AccountAdminrouter from "./routes/AccountRegisterAdmin.route.js";
import Inquirysection from "./routes/Inquiry.route.js";
import Requestservices from "./routes/Requestservices.route.js";
import Slidersection from "./routes/Slidersection.route.js";
import CourseSection from "./routes/Couressection.route.js";
import OttserviceSection from "./routes/Ottservice.route.js";
import OrderserviceSection from "./routes/Order.route.js";

const app = express();

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  "https://buycourse.lk",
  "https://www.buycourse.lk",
  "https://buycourse-lk-umlb.vercel.app" // Your current Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // 2. Check if the origin is in our whitelist OR is a Vercel preview domain
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Required for cookies/sessions
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// --- MIDDLEWARES ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
connectDB();

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use('/Adminlogin', AccountAdminloginrouter);
app.use('/Adminregister', AccountAdminrouter);
app.use('/Inquiry', Inquirysection);
app.use('/Requestservices', Requestservices);
app.use('/Slidersection', Slidersection);
app.use('/Couressection', CourseSection);
app.use('/Ottservice', OttserviceSection);
app.use('/Odder', OrderserviceSection);

// --- START SERVER ---
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});