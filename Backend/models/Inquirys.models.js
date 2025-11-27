import mongoose from 'mongoose';

// Define the schema
const InquirysSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    inquirytype: String,
    ordernumber: String,
    orderdate: String,
    date: String,
});


// Create the model
const Inquirys = mongoose.model('Inquirys', InquirysSchema);

// Export the model
export default Inquirys;
