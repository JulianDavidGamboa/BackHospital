const express = require('express');

const mdAuth = require('../middleware/autenticacion');

var app = express();

const Hospital = require('../models/hospital');

//*****************************
// OBTENER HOSPITALES
//*****************************
app.get('/', (req, res, next) => {

    var desde = req.query.desde  || 0;
    desde = Number(desde);

    Hospital.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec( (err, hospitales) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los hospitales',
                errors: err
            });
        }

        Hospital.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                hospitales,
                total: conteo
            });

        });


    });

});

//*****************************
// ACTUALIZAR HOSPITALES
//*****************************
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id; 

    Hospital.findById( id, (err, hospital) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital.',
                errors: err
            });

        }

        if ( !hospital ) {
        
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el id: ' + id + ', no existe.',
                errors: { message: 'No existe un hospital con ese id.' }
            })

        }

        var body = req.body;

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if ( err ) {

                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el hospital.',
                    errors: err
                });
    
            }

            res.status(200).json({
                ok: true,
                usuario: hospitalGuardado
            });

        });

    });

});

//*****************************
// AGREGAR HOSPITAL
//*****************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( ( err, hospitalGuardado ) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });  

});

//*****************************
// ELIMINAR USUARIO ṔOR ID
//*****************************
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al borrar hospital',
                errors: err
            });

        }

        if ( !hospitalBorrado ) {

            return res.status(400).json({
                ok: false,
                message: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id.' }
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});

module.exports = app;