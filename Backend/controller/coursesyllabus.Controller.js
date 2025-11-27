import moment from 'moment';

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

        const newCoures = new News({
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

        const savedcoures = await newCoures.save();

        res.status(201).json({
            status: 201,
            message: 'coures created successfully.',
            data: savedcoures,
        });
    } catch (error) {
        console.error('Error creating coures:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error. Could not create the coures.',
            error: error.message,
        });
    }
};
