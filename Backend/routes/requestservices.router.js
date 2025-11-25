import express from 'express';
import {Requestservicescreate } from '../controller/requestservices.Controller.js';

// Create a new router instance
const requestservices = express.Router();
// Create the Data Register
requestservices.post('/',Requestservicescreate);

// // View the Data Register

// // View the Single Data Register
// inquirysection.get("/:id",);

// //Delete Data Register
// inquirysection.delete('/:id',);

// //Update Data Register
// inquirysection.put('/:id',);


export default requestservices;
