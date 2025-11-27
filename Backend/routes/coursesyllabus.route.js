import express from 'express';
import { Newscreate, NewsDelete, NewsIndex, NewsSingleDetails, Newsupdate } from '../controller/News.Controller.js';

// Create a new router instance
const coursesyllabussection = express.Router();

// Create the Data Register
coursesyllabussection.post('/',Newscreate );

// View the Data Register
coursesyllabussection.get('/',NewsIndex);

// View the Single Data Register
coursesyllabussection.get("/:id",NewsSingleDetails);

//Delete Data Register
coursesyllabussection.delete('/:id',NewsDelete);

//Update Data Register
coursesyllabussection.put('/:id',Newsupdate);


export default coursesyllabussection;
