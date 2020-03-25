const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var mdAuth = require('../middlewae/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

//*****************************
// OTENER USUARIOS
//*****************************

app.get('/', (req, res, next) => {


    Usuario.find({ }, 'nombre email img role').exec( (err, usuarios) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando usuario.',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios
        });

    });

});


//*****************************
// ACTUALIZAR USUARIO
//*****************************
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id; 

    Usuario.findById( id, (err, usuario) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario.',
                errors: err
            });

        }

        if ( !usuario ) {
        
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el id: ' + id + ' ,no existe.',
                errors: { message: 'No existe un usuario con ese id.' }
            })

        }

        var body = req.body;

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if ( err ) {

                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el usuario.',
                    errors: err
                });
    
            }

            usuarioGuardado.password = '';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


//*****************************
// AGREGAR USUARIOS
//*****************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });  

});

//*****************************
// ELIMINAR USUARIO POR ID
//*****************************
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });

        }

        if ( !usuarioBorrado ) {

            return res.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id.' }
            });

        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;