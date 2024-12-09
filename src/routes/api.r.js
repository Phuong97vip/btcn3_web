// src\routes\api.r.js

const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movies.c');
const ReviewController = require('../controllers/review.c');
const CastController = require('../controllers/cast.c');

// Movie Routes
router.get('/movies/toprating/nitem=:n', MovieController.TopRatingMV);
router.get('/movies/topboxoffice/nitem=:n', MovieController.TopBoxOffice);
router.get('/movies/detail/id=:id', MovieController.Detail);
router.get('/movies/pic/id=:id', MovieController.GetPic);
router.get('/movies/director/id=:id', MovieController.GetDirector);
router.get('/movies/writer/id=:id', MovieController.GetWriter);
router.get('/movies/actor/id=:id', MovieController.GetActor);
router.get('/movies/search/per_page=:per_page/page=:page/str=:str/type=:type', MovieController.search);
router.get('/movies/fav/per_page=:per_page/page=:page', MovieController.fav);
router.get('/movies/fav/add/id=:id', MovieController.AddFav);
router.get('/movies/topfav/nitem=:n', MovieController.TopFav);

// Route POST để xử lý thêm phim
router.post('/movies/add', MovieController.AddMovie);

// Review Routes
router.get('/review/id=:id/per_page=:per_page/page=:page', ReviewController.GetReview);

// Cast Routes
router.get('/castMovies/id=:id', CastController.GetMovies);

router.delete('/fav/:id', MovieController.RemoveFav);


module.exports = router;
