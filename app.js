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
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Conections to database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', 
    { 
        useCreateIndex: true, 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false 
    }, ( err, res ) => {

    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Server index config
// const serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Settings
app.set('port', process.env.PORT || 3000);


// Server is listening
app.listen(app.get('port'), () => {

    console.log('Server \x1b[32m%s\x1b[0m','online in port ' + app.get('port'));

});