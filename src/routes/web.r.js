// src\routes\web.r.js

const express = require('express');
const router = express.Router();
const webController = require('../controllers/web.c');
const db = require('../database/db'); // Assuming this is required in web routes
const path = require('path'); // Thêm dòng này

// Web Routes
router.get('/', webController.index);
router.get('/dark=:dark', webController.index);
router.get('/detail/movies/id=:id/dark=:dark', webController.detailMovies);
router.get('/detail/actor/id=:id/dark=:dark', webController.detailActor);
router.post('/search/dark=:dark', webController.postSearch);
router.get('/search/str=:str/type=:type/dark=:dark', webController.getSearch);
router.get('/fav/dark=:dark', webController.fav);

router.get('/movies/add', webController.addMoviePage);


module.exports = router;
