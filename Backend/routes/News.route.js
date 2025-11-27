import express from 'express';
import { Newscreate, NewsDelete, NewsIndex, NewsSingleDetails, Newsupdate } from '../controller/News.Controller.js';

// Create a new router instance
const Newssection = express.Router();

// Create the Data Register
Newssection.post('/',Newscreate );

// View the Data Register
Newssection.get('/',NewsIndex);

// View the Single Data Register
Newssection.get("/:id",NewsSingleDetails);

//Delete Data Register
Newssection.delete('/:id',NewsDelete);

//Update Data Register
Newssection.put('/:id',Newsupdate);


export default Newssection;
