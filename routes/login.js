const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

const app = express();

const Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });

        }
    
        if( !usuarioDB ) {

            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });

        }

        if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {

            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // Token!
        usuarioDB.password = '';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14000})


        res.status(200).json({
            ok: true,
            usuarioDB,
            token,
            body
        })
    
    });


});


module.exports = app;