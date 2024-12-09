// src/database/db.js

const axios = require('axios');
const pgp = require('pg-promise')({ capSQL: true });
require('dotenv').config(); // Load environment variables

// Debugging: Log environment variables
console.log('Environment Variables Loaded db.js:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const config = {
    host: process.env.DB_HOST,          // e.g., 'localhost'
    port: process.env.DB_PORT,          // e.g., 5433
    database: process.env.DB_NAME,      // e.g., 'wad2231db'
    user: process.env.DB_USER,          // e.g., 'u21120534'
    password: process.env.DB_PASSWORD,  // e.g., 'r*N97D8J'
    searchPath: ['s21534']               // Ensures all operations are within the 's21534' schema
};

// Initialize pg-promise
const db = pgp(config);

// Function to execute SQL queries
const execute = async (sql, params) => {
    let dbcn = null;
    try {
        dbcn = await db.connect();
        const data = await dbcn.query(sql, params);
        return data;
    } catch (error) {
        throw error;
    } finally {
        if (dbcn) {
            dbcn.done();
        }
    }
};

// Function to create tables within schema s21534
const createTables = async () => {
    try {
        // Define table creation queries
        const tableQueries = [
            // Bảng images
            `
            CREATE TABLE IF NOT EXISTS images (
                id TEXT NOT NULL,
                title TEXT,
                image TEXT,
                PRIMARY KEY (id, image)
            );
            `,
            // Bảng movies
            `
            CREATE TABLE IF NOT EXISTS movies (
                id TEXT PRIMARY KEY,
                title TEXT,
                originaltitle TEXT,
                fulltitle TEXT,
                year TEXT,
                image TEXT,
                releasedate DATE,
                runtimemins INTEGER,
                runtimestr TEXT,
                plot TEXT,
                awards TEXT,
                companies TEXT,
                countries TEXT,
                languages TEXT,
                imdbrating DOUBLE PRECISION,
                imdbratingcount INTEGER,
                boxoffice JSONB,
                plotfull TEXT
            );
            `,
            // Bảng names
            `
            CREATE TABLE IF NOT EXISTS names (
                id TEXT PRIMARY KEY,
                name TEXT,
                role TEXT,
                image TEXT,
                summary TEXT,
                birthdate DATE,
                deathdate DATE,
                awards TEXT,
                height TEXT
            );
            `,
            // Bảng reviews
            `
            CREATE TABLE IF NOT EXISTS reviews (
                movieid TEXT,
                username TEXT,
                warningspoilers BOOLEAN,
                date DATE,
                rate TEXT,
                title TEXT,
                content TEXT,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE
            );
            `,
            // Bảng directors
            `
            CREATE TABLE IF NOT EXISTS directors (
                movieid TEXT,
                namesid TEXT,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (namesid) REFERENCES names(id) ON DELETE CASCADE
            );
            `,
            // Bảng writers
            `
            CREATE TABLE IF NOT EXISTS writers (
                movieid TEXT,
                namesid TEXT,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (namesid) REFERENCES names(id) ON DELETE CASCADE
            );
            `,
            // Bảng actors
            `
            CREATE TABLE IF NOT EXISTS actors (
                movieid TEXT,
                namesid TEXT,
                ascharacter TEXT,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (namesid) REFERENCES names(id) ON DELETE CASCADE
            );
            `,
            // Bảng genreList
            `
            CREATE TABLE IF NOT EXISTS genrelist (
                movieid TEXT,
                type TEXT,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE
            );
            `,
            // Bảng fav
            `
            CREATE TABLE IF NOT EXISTS fav (
                movieid TEXT PRIMARY KEY,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE
            );
            `,
            // Bảng castMovies
            `
            CREATE TABLE IF NOT EXISTS castmovies (
                namesid TEXT,
                movieid TEXT,
                role TEXT,
                FOREIGN KEY (namesid) REFERENCES names(id) ON DELETE CASCADE,
                FOREIGN KEY (movieid) REFERENCES movies(id) ON DELETE CASCADE
            );
            `
        ];

        // Execute each table creation query
        for (const query of tableQueries) {
            await execute(query);
        }

        console.log('Các bảng đã được tạo hoặc đã tồn tại trong schema "s21534".');

        // Đảm bảo rằng tất cả các cột cần thiết đều tồn tại trong bảng movies
        const alterTablesQueries = [
            // Bảng movies: Thêm cột nếu chưa tồn tại
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS originaltitle TEXT;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS fulltitle TEXT;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS releasedate DATE;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS runtimemins INTEGER;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS runtimestr TEXT;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS imdbratingcount INTEGER;
            `,
            `
            ALTER TABLE movies
            ADD COLUMN IF NOT EXISTS plotfull TEXT;
            `
            // Bạn có thể thêm các lệnh ALTER TABLE tương tự cho các bảng khác nếu cần
        ];

        // Thực hiện các lệnh ALTER TABLE
        for (const query of alterTablesQueries) {
            await execute(query);
        }

        console.log('Các cột bổ sung đã được thêm vào bảng "movies" nếu chúng chưa tồn tại.');
    } catch (error) {
        console.error('Lỗi khi tạo bảng hoặc thêm cột:', error);
        throw error;
    }
};

// Function to fetch data from APIs
const fetchDataFromAPI = async () => {
    try {
        const [moviesRes, namesRes, reviewsRes, top50Res, mostPopularRes] = await Promise.all([
            axios.get(process.env.MOVIES_API_URL || 'http://matuan.online:2422/api/Movies'),
            axios.get(process.env.NAMES_API_URL || 'http://matuan.online:2422/api/Names'),
            axios.get(process.env.REVIEWS_API_URL || 'http://matuan.online:2422/api/Reviews'),
            axios.get(process.env.TOP50_API_URL || 'http://matuan.online:2422/api/Top50Movies'),
            axios.get(process.env.MOST_POPULAR_API_URL || 'http://matuan.online:2422/api/MostPopularMovies')
        ]);

        return {
            Movies: moviesRes.data,
            Names: namesRes.data,
            Reviews: reviewsRes.data,
            Top50Movies: top50Res.data,
            MostPopularMovies: mostPopularRes.data
        };
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

// Helper function to insert data only if array is non-empty
const insertIfNotEmpty = async (t, data, columnSet, tableName) => {
    if (data && data.length > 0) {
        const query = pgp.helpers.insert(data, columnSet) + ' ON CONFLICT DO NOTHING';
        await t.none(query);
        console.log(`Đã chèn ${data.length} bản ghi vào bảng "${tableName}".`);
    } else {
        console.log(`Không có dữ liệu để chèn vào bảng "${tableName}".`);
    }
};

// Function to insert data into tables
const insertData = async (data) => {
    try {
        await db.tx(async t => {
            // **1. Insert Names and Images**
            const namesCount = await t.one('SELECT COUNT(*) FROM names', [], a => +a.count);
            if (namesCount === 0) {
                if (data.Names && data.Names.length > 0) {
                    // Existing code for inserting names and images
                    // ...
                }
            } else {
                console.log('Names table already has data. Skipping insertion.');
            }

            // **2. Insert Movies from all sources**
            const moviesCount = await t.one('SELECT COUNT(*) FROM movies', [], a => +a.count);
            if (moviesCount === 0) {
                const allMovies = [
                    ...(data.Movies || []),
                    ...(data.Top50Movies || []),
                    ...(data.MostPopularMovies || [])
                ];

                if (allMovies.length > 0) {
                    // Existing code for inserting movies and images
                    // ...
                }
            } else {
                console.log('Movies table already has data. Skipping insertion.');
            }

            // **3. Insert Reviews**
            const reviewsCount = await t.one('SELECT COUNT(*) FROM reviews', [], a => +a.count);
            if (reviewsCount === 0) {
                if (data.Reviews && data.Reviews.length > 0) {
                    // Existing code for inserting reviews
                    // ...
                }
            } else {
                console.log('Reviews table already has data. Skipping insertion.');
            }

            // **4. Insert Directors**
            const directorsCount = await t.one('SELECT COUNT(*) FROM directors', [], a => +a.count);
            if (directorsCount === 0) {
                // Existing code for inserting directors
                // ...
            } else {
                console.log('Directors table already has data. Skipping insertion.');
            }

            // **5. Insert Writers**
            const writersCount = await t.one('SELECT COUNT(*) FROM writers', [], a => +a.count);
            if (writersCount === 0) {
                // Existing code for inserting writers
                // ...
            } else {
                console.log('Writers table already has data. Skipping insertion.');
            }

            // **6. Insert Actors**
            const actorsCount = await t.one('SELECT COUNT(*) FROM actors', [], a => +a.count);
            if (actorsCount === 0) {
                // Existing code for inserting actors
                // ...
            } else {
                console.log('Actors table already has data. Skipping insertion.');
            }

            // **7. Insert GenreList**
            const genresCount = await t.one('SELECT COUNT(*) FROM genrelist', [], a => +a.count);
            if (genresCount === 0) {
                // Existing code for inserting genrelist
                // ...
            } else {
                console.log('GenreList table already has data. Skipping insertion.');
            }

            // **8. Insert CastMovies**
            const castMoviesCount = await t.one('SELECT COUNT(*) FROM castmovies', [], a => +a.count);
            if (castMoviesCount === 0) {
                if (data.Names && data.Names.length > 0) {
                    // Existing code for inserting castmovies
                    // ...
                }
            } else {
                console.log('CastMovies table already has data. Skipping insertion.');
            }
        });
        console.log('Dữ liệu đã được chèn vào cơ sở dữ liệu.');
    } catch (error) {
        console.error('Lỗi khi chèn dữ liệu:', error);
        throw error;
    }
};

// Function to initialize the database
const initDB = async () => {
    try {
        // Create tables in schema s21534
        await createTables();

        // Fetch data from APIs
        const apiData = await fetchDataFromAPI();

        // Insert data into tables
        await insertData(apiData);

        console.log('Database đã được khởi tạo và dữ liệu đã được chèn thành công.');
    } catch (error) {
        console.error('Lỗi khi khởi tạo database:', error);
        throw error;
    }
};

// Export functions for use in other modules
module.exports = {
    execute,
    initDB
};
