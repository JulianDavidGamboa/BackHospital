const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initializations
const app = express();

// BodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import Routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginroutes = require('./routes/login');

// Conections to database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', 
    { useCreateIndex: true, useNewUrlParser: true }, ( err, res ) => {

    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})

// Routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginroutes);
app.use('/', appRoutes);

// Settings
app.set('port', process.env.PORT || 3000);


// Server is listening
app.listen(app.get('port'), () => {

    console.log('Server \x1b[32m%s\x1b[0m','online in port ' + app.get('port'));

});