import express from 'express';
import {requestIndex, Requestservicescreate } from '../controller/Requestservices.Controller.js';

// Create a new router instance
const requestservices = express.Router()
// Create the Data Register
requestservices.post('/',Requestservicescreate);

// // View the Data Register
requestservices.get('/',requestIndex);



export default requestservices;
