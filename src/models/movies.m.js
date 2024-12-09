// src\models\movies.m.js
const db = require('../database/db')
const { v4: uuidv4 } = require('uuid'); // Import hàm tạo UUID


module.exports = class Movies {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.originalTitle = obj.originaltitle;
        this.fullTitle = obj.fulltitle;
        this.year = obj.year;
        this.image = obj.image;
        this.releaseDate = obj.releasedate;
        this.runtimeStr = obj.runtimestr;
        this.plot = obj.plot;
        this.awards = obj.awards;
        this.companies = obj.companies;
        this.countries = obj.countries;
        this.languages = obj.languages;
        this.imDbRating = obj.imdbrating;
        this.boxOffice = obj.boxoffice;
        this.plotFull = obj.plot;
    }
    static async getAll() {
        const result = await db.execute(`select * from movies`)
        const data = {
            total: parseInt(result.length),
            total_page: Math.ceil(result.length / 2),
            movies: result.map((m) => {
                return new Movies(m);
            }),
        };
        return data;
    }
    static async addMovie(movieData) {
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
            } = movieData;

            // Kiểm tra các trường bắt buộc
            if (!title || !year || !image) {
                throw new Error('Title, Year, and Image URL are required.');
            }

            // Tạo UUID cho phim mới
            const newId = uuidv4();

            const query = `
                INSERT INTO movies (
                    id, title, originaltitle, fulltitle, year, image, releasedate,
                    runtimestr, plot, awards, companies, countries, languages,
                    imdbrating, boxoffice
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13,
                    $14, $15
                ) RETURNING *;
            `;

            const values = [
                newId,
                title,
                originalTitle || null,
                fullTitle || null,
                year,
                image,
                releaseDate || null,
                runtimeStr || null,
                plot || null,
                awards || null,
                companies || null,
                countries || null,
                languages || null,
                imDbRating || null,
                boxOffice || null
            ];

            const result = await db.execute(query, values);
            return result.length > 0;

        } catch (error) {
            console.error('Error in addMovie:', error);
            return false;
        }
    }
    static async detail(id) {
        const result = await db.execute(`SELECT * FROM movies WHERE id = '${id}';`);
        return {
            movies: result.map((m) => {
                return new Movies(m);
            }),
        }
    }
    static async getSearchMV(perPage, page, searchString, type) {
        const offSet = (page - 1) * perPage;
        searchString = searchString.trim();
        let total;
        let result
        if (type == 'Actor') {
            total = await db.execute(`select count(*) from movies m join actors a on m.id = a.movieid
                                                            join names n on n.id = a.namesid
                                                            where n.name ilike '%${searchString}%'`);
            result = await db.execute(`select m.* from movies m join actors a on m.id = a.movieid
                                                            join names n on n.id = a.namesid
                                                            where n.name ilike '%${searchString}%' LIMIT ${perPage} OFFSET ${offSet};`)
        } else if (type == 'Title') {
            total = await db.execute(`SELECT count(*) FROM movies WHERE title ILIKE '%${searchString}%';`);
            result = await db.execute(`SELECT * FROM movies WHERE title ILIKE '%${searchString}%' LIMIT ${perPage} OFFSET ${offSet};`)

        } else if (type == 'Type') {
            total = await db.execute(`SELECT count(*) FROM movies m join genrelist g on m.id = g.movieid where g.type ilike '%${searchString}%';`);
            result = await db.execute(`SELECT m.* FROM movies m join genrelist g on m.id = g.movieid WHERE type ilike '%${searchString}%' LIMIT ${perPage} OFFSET ${offSet};`);
        }
        return {
            perPage: perPage,
            page: page,
            nPage: Math.ceil(total[0].count / perPage),
            movies: result.map((m) => {
                return new Movies(m);
            }),
        }
    }
    static async getTopRating(perPage) {
        const result = await db.execute(`SELECT * FROM movies ORDER BY imDbRating DESC LIMIT ${perPage} ;`);
        return {
            perPage: perPage,
            movies: result.map((m) => {
                return new Movies(m);
            }),
        }
    }
    static async getTopFav(perPage) {
        const result = await db.execute(`SELECT distinct  m.* FROM movies m join fav f on m.id = f.movieid ORDER BY imDbRating DESC LIMIT ${perPage} ;`);
        return {
            perPage: perPage,
            movies: result.map((m) => {
                return new Movies(m);
            }),
        }
    }
    static async getTopBoxOffice(perPage) {
        let result = await db.execute(`SELECT * FROM movies;`);
        result = result.sort((a, b) => {
            const grossStrA = a.boxoffice && a.boxoffice.cumulativeWorldwideGross ? a.boxoffice.cumulativeWorldwideGross : "";
            const grossStrB = b.boxoffice && b.boxoffice.cumulativeWorldwideGross ? b.boxoffice.cumulativeWorldwideGross : "";
    
            const grossValA = Number(grossStrA.replace(/[^0-9.-]+/g, ""));
            const grossValB = Number(grossStrB.replace(/[^0-9.-]+/g, ""));
    
            return grossValB - grossValA;
        });
        result = result.slice(0, perPage);
        return {
            perPage: perPage,
            movies: result.map((m) => new Movies(m)),
        };
    }
    static async getPic(id) {
        let result = await db.execute(`SELECT distinct * FROM images where id = '${id}';`);
        return result;
    }
    static async getDirector(id) {
        let result = await db.execute(`SELECT distinct name,id FROM directors d JOIN names n ON d.namesid = n.id where movieid = '${id}';
        `);
        return result;
    }
    static async getWriter(id) {
        let result = await db.execute(`SELECT distinct name,id FROM writers w JOIN names n ON w.namesid = n.id where movieid = '${id}';
        `);
        return result;
    }
    static async getActor(id) {
        let result = await db.execute(`select  distinct name, id from actors a join names n on a.namesid = n.id where movieid = '${id}';
        `);
        return result;
    }
    static async getFav(perPage, page) {
        const offSet = (page - 1) * perPage;
        let total;
        let result
        total = await db.execute(`SELECT count(*) FROM movies m join  fav f on m.id = f.movieid;`);
        result = await db.execute(`SELECT distinct m.* FROM movies m join  fav f on m.id = f.movieid LIMIT ${perPage} OFFSET ${offSet};`)
        return {
            perPage: perPage,
            page: page,
            nPage: Math.ceil(total[0].count / perPage),
            movies: result.map((m) => {
                return new Movies(m);
            }),
        }
    }
    static async removeFav(id) {
        try {
            const query = `DELETE FROM fav WHERE movieid = $1;`;
            const values = [id];
            await db.execute(query, values);
            return true;
        } catch (error) {
            console.error('Error in removeFav:', error);
            return false;
        }
    }
    static async addFav(id) {
        try {
            await db.execute(`INSERT INTO fav(
            movieid)
            VALUES ('${id}');`);
            return true;
        } catch (error) {
            return false;
        };
    }


}