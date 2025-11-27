
import moment from 'moment';
import News from '../models/News.models.js';


export const Courescreate = async (req, res) => {
    const { filename } = req.file;
    const { newsname, newsdec } = req.body;

    // Input validation
    if (!newsname || !newsdec || !filename) {
        return res.status(400).json({
            status: 400,
            message: 'Please provide gift name, gift type, and gift image.'
        });
    }

    try {
        const date = moment().format('YYYY-MM-DD');

        const newNews = new News({
            newsname,
            newsdec,
            newsimage: filename,
            date,
        });

        const savedNews = await newNews.save();

        res.status(201).json({
            status: 201,
            message: 'News created successfully.',
            data: savedNews,
        });
    } catch (error) {
        console.error('Error creating News:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error. Could not create the News.',
            error: error.message,
        });
    }
};