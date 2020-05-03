const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



const app = express();

const Usuario = require('../models/usuario');

// ======================
//  Normal Authentication
// ======================

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });

        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // Token!
        usuarioDB.password = '';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14000 })


        res.status(200).json({
            ok: true,
            usuarioDB,
            token,
            body
        })

    });


});


// =======================
//  Google Authentication
// =======================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}

app.post('/google', async (req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                message: 'Token no valido'
            });
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el usuario',
                errors: err
            });
        }

        // Si existe un usuario
        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe usar su autenticación normal.'
                });
            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14000 })

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token,
                    id: usuarioDB._id
                });

            }

        } else {
            // El usuario no existe.

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'This is not my password.';

            usuario.save((err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14000 })

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token,
                    id: usuarioDB._id
                });

            });

        }

    })

});

module.exports = app;