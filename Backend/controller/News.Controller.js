import moment from 'moment';
import News from '../models/News.models.js';

export const Newscreate = async (req, res) => {
    const { courseName, courseDescription,coursePrice,duration,courseImage ,mainHeadings,courseCategory,coursedemovideolink } = req.body;

    // Input validation
    if (!courseName || !courseDescription || !coursePrice || !duration|| !courseImage|| !mainHeadings|| !courseCategory|| !coursedemovideolink) {
        return res.status(400).json({
            status: 400,
            message: 'Please provide gift name, gift type, and gift image.'
        });
    }

    try {
        const date = moment().format('YYYY-MM-DD');

        const newNews = new News({
            courseName,
            courseDescription,
            coursePrice,
            duration,
            courseImage,
            mainHeadings: mainHeadings || [],
            courseCategory,
            coursedemovideolink,
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

// All Acccount View 
export const NewsIndex = async (req, res) => {
    try {
        const Newsview = await News.find();
        res.json(Newsview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

// single Acccount View 
export const NewsSingleDetails = async (req, res) => {
    try {
        const NewsSingleView = await News.findById(req.params.id);
        if (NewsSingleView == null) {
            return res.status(404).json({ message: "Cannot Find The News" });
        }
        else {
            res.json(NewsSingleView);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
  };

// All Acccount Delete
export const NewsDelete = async (req, res) => {
    const NewsId =  req.params.id;

    try {
         await News.deleteOne({_id: NewsId})
         res.json({message:"User News deleted!"});
    } catch (error) {
     res.status(500).json({message:error.message})
    }
};


// All Acccount Update
export const Newsupdate  = async (req, res) => {
    const { id } = req.params;
    const { newsname } = req.body;
    const { newsdec } = req.body;
    const { file } = req;

    try {
        // Find the user by ID
        const user = await News.findById(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        // Update user details
        if (newsname) {
            user.newsname = newsname;
        }
        if (newsdec) {
            user.newsdec = newsdec;
        }
        // Update image if a new file is uploaded
        if (file) {
            user.newsimage = file.filename;
        }

        // Save the updated user data
        const updatedUser = await user.save();

        res.status(200).json({ status: 200, updatedUser });
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
};
