import express from 'express';
import { inquirycreate, InquiryIndex } from '../controller/inquiry.Controller.js';

// Create a new router instance
const inquirysection = express.Router();
// Create the Data Register
inquirysection.post('/',inquirycreate );

// // View the Data Register
inquirysection.get('/',InquiryIndex);


export default inquirysection;
