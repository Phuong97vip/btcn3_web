//src\controllers\review.c.js
const Review = require('../models/review.m')

module.exports = {
    GetReview: async (req,res,next) => {
        try {
            const data = await Review.getReview(req.params.per_page,req.params.page,req.params.id);
            res.json(data)
        } catch (error) {
            next(error);
        };
        
    },
    AddReview: async (req, res, next) => {
        try {
            const {
                movieid,
                username,
                warningspoilers,
                rate,
                title,
                content
            } = req.body;

            // Validate required fields
            if (!movieid || !username || !rate) {
                return res.status(400).json({ message: 'Movie ID, Username, and Rate are required.' });
            }

            // Add the new review to the database
            const success = await Review.addReview({
                movieid,
                username,
                warningspoilers,
                date: new Date(), // Set current date
                rate,
                title,
                content
            });

            if (success) {
                res.status(201).json({ message: 'Review added successfully.' });
            } else {
                res.status(500).json({ message: 'Failed to add the review.' });
            }
        } catch (error) {
            console.error('Error in AddReview controller:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
}