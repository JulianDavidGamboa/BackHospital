const express = require('express');

const fileUpload = require('express-fileupload');
const fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medicos = require('../models/medico');
var Hospitales = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'usuarios', 'medicos'];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        res.status(400).json({
            ok: false,
            message: 'El tipo de coleción no es válida.',
            nombreCortado
        })
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            errors: { message: 'Debe selccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // Sólo estas extensiones aceptamos.
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extencionesValidas.indexOf( extencionArchivo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no válida.',
            errors: { message: 'Las extensiones válidas son ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencionArchivo }`;

    // Mover el archivo temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error al mover el archivo.',
                errors: err
            });

        }

        subirPorTipo( tipo, id, nombreArchivo, res );
    
    });


});

function subirPorTipo( tipo, id, nombreArchivo, res ) {

    if ( tipo === 'usuarios' ) {

        Usuario.findById( id, ( err, usuario ) => {

            if ( !usuario ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior.
            if( fs.existsSync(pathViejo) ) {

                fs.unlinkSync( pathViejo );

            }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) => {

                usuarioActualizado.password = 'Its not my password';

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });


        });

    }

    if ( tipo === 'medicos' ) {
        
        Medicos.findById( id, ( err, medicos ) => {

            if ( !medicos ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }


            var pathViejo = './uploads/medicos/' + medicos.img;

            // Si existe, elimina la imagen anterior.
            if( fs.existsSync(pathViejo) ) {

                fs.unlinkSync( pathViejo );

            }

            medicos.img = nombreArchivo;

            medicos.save( (err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });

        });

    }

    if ( tipo === 'hospitales' ) {
        
        Hospitales.findById( id, ( err, hospitales ) => {

            if ( !hospitales ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospitales.img;

            // Si existe, elimina la imagen anterior.
            if( fs.existsSync(pathViejo) ) {

                fs.unlinkSync( pathViejo );

            }

            hospitales.img = nombreArchivo;

            hospitales.save( (err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });

        });

    }

}


module.exports = app;