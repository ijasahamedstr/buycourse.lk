import express from 'express';
import {requestIndex, Requestservicescreate } from '../controller/Requestservices.Controller.js';

// Create a new router instance
const Requestservices = express.Router();
// Create the Data Register
Requestservices.post('/',Requestservicescreate);

// // View the Data Register
Requestservices.get('/',requestIndex);



export default Requestservices;
