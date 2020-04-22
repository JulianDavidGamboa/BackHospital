var express = require('express');

const mdAuth = require('../middleware/autenticacion');

var app = express();

const Medico = require('../models/medico');


//*****************************
// OBTENER MEDICOS
//*****************************
app.get('/', (req, res, next) => {

    var desde = req.query.desde  || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medicos) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los medicos',
                errors: err
            });
        }

        Medico.count({}, (err, conteo) => {
            
            res.status(200).json({
                ok: true,
                medicos,
                total: conteo
            });

        })


    });

});

//*****************************
// ACTUALIZAR MEDICOS
//*****************************
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findById(id, (err, medico) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital.',
                errors: err
            });

        }

        if( !medico ) {

            return res.status(400).json({
                ok: false,
                message: 'El medico con el id: ' + id + ', no existe.',
                errors: { message: 'No existe un hospital con ese id.' }
            });

        }

        var body = req.body;

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if ( err ) {

                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el medico.',
                    errors: err
                });
    
            }

            res.status(200).json({
                ok: true,
                usuario: medicoGuardado
            });

        });

    });

});


//*****************************
// AGREGAR HOSPITAL
//*****************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( err, medicoGuardado ) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.medico
        });

    });  

});

//*****************************
// ELIMINAR USUARIO ṔOR ID
//*****************************
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al borrar medico',
                errors: err
            });

        }

        if ( !medicoBorrado ) {

            return res.status(400).json({
                ok: false,
                message: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id.' }
            });

        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;
