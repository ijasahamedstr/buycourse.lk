import express from 'express';
import { Courescreate } from '../controller/coures.Controller.js';

// Create a new router instance
const Couressection = express.Router();


// Create the Data Register
Couressection.post('/', Courescreate);



export default Couressection;