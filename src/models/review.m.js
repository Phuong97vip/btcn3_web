// src\models\review.m.js
const db = require('../database/db')
const { v4: uuidv4 } = require('uuid'); // Import uuidv4


module.exports = class Review {
    constructor(obj) {
        this.username = obj.username;
        this.warningspoilers = obj.warningspoilers;
        this.date = obj.date;
        this.rate = obj.rate;
        this.title = obj.title;
        this.content = obj.content;
    }
    static async getReview(perPage, page, id) {
        const offSet = (page - 1) * perPage;
        const total = await db.execute(`SELECT count(*) FROM reviews WHERE movieid = '${id}';`);
        const result = await db.execute(`SELECT * FROM reviews WHERE movieid = '${id}' ORDER BY date ASC LIMIT ${perPage} OFFSET ${offSet};`);        return {
            perPage: perPage,
            page: page,
            total: parseInt(total[0].count),
            reviews: result.map((r) => {
                return new Review(r);
            }),
        }
    }
    static async addReview(reviewData) {
        try {
            const {
                movieid,
                username,
                warningspoilers,
                date,
                rate,
                title,
                content
            } = reviewData;

            // Validate required fields
            if (!movieid || !username || !rate) {
                throw new Error('Movie ID, Username, and Rate are required.');
            }

            const query = `
                INSERT INTO reviews (
                    movieid, username, warningspoilers, date, rate, title, content
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                ) RETURNING *;
            `;

            const values = [
                movieid,
                username,
                warningspoilers || false,
                date || new Date(), // Use current date if not provided
                rate,
                title || null,
                content || null
            ];

            const result = await db.execute(query, values);
            return result.length > 0; // Check if insertion was successful
        } catch (error) {
            console.error('Error in addReview:', error);
            return false;
        }
    }

}