const express = require('express');
require('dotenv').config(); // Load environment variables first
const database = require('./database/db'); // Corrected path
const webRouter = require('./routes/web.r.js');  
const apiRouter = require('./routes/api.r.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(webRouter);
app.use('/api', apiRouter);

database.initDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port number ${port}`);
        });
    })
    .catch((error) => {
        console.error('Ứng dụng gặp lỗi:', error);
        process.exit(1);
    });