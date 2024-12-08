// src/configs/staticResource.js

const express = require('express');
const path = require('path');

const configStaticResource = (app) => {
    // Sử dụng path.join với __dirname để đảm bảo đường dẫn đúng
    app.use(express.static(path.join(__dirname, '../public')));
}

module.exports = configStaticResource;
