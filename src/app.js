const express = require('express');
const configViewEngine = require('./configs/viewEngine');          // Ensure the path is correct
const configStaticResource = require('./configs/staticResource')
require('dotenv').config(); // Load environment variables first
const database = require('./database/db'); // Corrected path
const webRouter = require('./routes/web.r.js');  
const apiRouter = require('./routes/api.r.js');
const { NotFound, errHandling } = require('./middlewares/errorsHandlingMW'); // Ensure the path is correct



const app = express();
const port = process.env.PORT || 3000;


configViewEngine(app);
configStaticResource(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(webRouter);
app.use('/api', apiRouter);

// Handle 404 and other errors
app.use(NotFound);
app.use(errHandling);


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