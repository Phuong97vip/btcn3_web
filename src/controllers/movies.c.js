// src\controllers\movies.c.js
const Movies = require('../models/movies.m')

module.exports = {
    AddMovie: async (req, res, next) => {
        try {
            const {
                title,
                originalTitle,
                fullTitle,
                year,
                image,
                releaseDate,
                runtimeStr,
                plot,
                awards,
                companies,
                countries,
                languages,
                imDbRating,
                boxOffice
            } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!title || !year || !image) {
                return res.status(400).json({ message: 'Title, Year, and Image URL are required.' });
            }

            // Thêm phim mới vào cơ sở dữ liệu
            const success = await Movies.addMovie({
                title,
                originalTitle,
                fullTitle,
                year,
                image,
                releaseDate,
                runtimeStr,
                plot,
                awards,
                companies,
                countries,
                languages,
                imDbRating,
                boxOffice
            });

            if (success) {
                res.status(201).json({ message: 'Movie added successfully.' });
            } else {
                res.status(500).json({ message: 'Failed to add the movie.' });
            }
        } catch (error) {
            console.error('Error in AddMovie controller:', error);
            next(error);
        }
    },
    TopRatingMV: async (req, res, next) => {
        try {
            const topRating = await Movies.getTopRating(req.params.n);
            res.json(topRating)
        } catch (error) {
            next(error);
        };
    },
    TopFav: async (req, res, next) => {
        try {
            const topRating = await Movies.getTopFav(req.params.n);
            res.json(topRating)
        } catch (error) {
            next(error);
        };
    },
    TopBoxOffice: async (req, res, next) => {
        try {
            const topboxoffice = await Movies.getTopBoxOffice(req.params.n);
            res.json(topboxoffice)
        } catch (error) {
            next(error);
        };
    },
    Detail: async (req, res, next) => {
        try {
            const detail = await Movies.detail(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    GetPic:  async (req, res, next) => {
        try {
            const detail = await Movies.getPic(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    GetDirector:  async (req, res, next) => {
        try {
            const detail = await Movies.getDirector(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    GetWriter:  async (req, res, next) => {
        try {
            const detail = await Movies.getWriter(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    GetActor: async (req, res, next) => {
        try {
            const detail = await Movies.getActor(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    search: async (req, res, next) => {
        try {
            const detail = await Movies.getSearchMV(req.params.per_page,req.params.page,req.params.str,req.params.type);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    fav: async (req, res, next) => {
        try {
            const detail = await Movies.getFav(req.params.per_page,req.params.page);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    AddFav: async (req, res, next) => {
        try {
            const detail = await Movies.addFav(req.params.id);
            res.json(detail)
        } catch (error) {
            next(error);
        };
    },
    RemoveFav: async (req, res, next) => {
        try {
            const { id } = req.params;
            const success = await Movies.removeFav(id);
            if (success) {
                res.status(200).json({ message: 'Phim đã được xóa khỏi danh sách yêu thích.' });
            } else {
                res.status(500).json({ message: 'Không thể xóa phim yêu thích.' });
            }
        } catch (error) {
            next(error);
        }
    },

}