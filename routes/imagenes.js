const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pahtImagen = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` )

    if ( fs.existsSync( pahtImagen ) ) {
        res.sendFile( pahtImagen );
    } else {
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;