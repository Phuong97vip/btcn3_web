// src\configs\viewEngine.js
const path = require('path');
const fs = require("fs");
const renderEngine  = require('../../21534.js');



const configViewEngine = (app) => {
    console.log('Path to renderEngine:', path.resolve(__dirname, '../../21534.js'));
    console.log('renderEngine:', renderEngine);
    app.engine('html', async (filePath, options, callBack) => {
        await renderEngine(filePath, options, callBack);
    } );
    app.set('views', path.join('./src', 'views'));
    app.set("view engine", 'html');
}

module.exports = configViewEngine;