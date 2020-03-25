const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

//*****************************
// VERIFICAR TOKEN - MIDDLEWAE
//*****************************
exports.verificaToken = function(req, res, next) {
    
    var token = req.query.token;
    
    jwt.verify( token, SEED, ( err, decoded ) => {
    
        if ( err ) {
            return res.status(401).json({
                ok: false,
                message: 'Token incorrecto.',
                errors: err
            });
        }
    
        req.usuario = decoded.usuario;

        next();
        
        // res.status(200).json({
        //     ok: true,
        //     decoded
        // });

    });

}