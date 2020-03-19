const express = require('express');
const mongoose = require('mongoose');

// Initializations
const app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {

    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})

// Routes
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    })

});

// Settings
app.set('port', process.env.PORT || 3000);


// Server is listening
app.listen(app.get('port'), () => {

    console.log('Server \x1b[32m%s\x1b[0m','online in port ' + app.get('port'));

});