
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;




// ====================================================== //
// ======== Verificar Token por parámetro en URL ======== //
// ====================================================== //
exports.verificaToken = function(req, res, next) {

	var token = req.query.token;

	// Verificar la validez del token
	jwt.verify( token, SEED, (err, decoded)=>{
		if ( err ) {
			return res.status(401).json({
				ok: false,
				message: 'Token inválido',
				errors: err
			});
		}

		req.usuarioToken = decoded.usuario;
		
		next();
		// return res.status(200).json({
		// 	ok: true,
		// 	decoded: decoded
		// });

	});
};




// ====================================================== //
// ======== Verificar Token por parámetro en URL ======== //
// ====================================================== //
// app.use('/', (req, res, next)=>{
// 	var token = req.query.token;

// 	// Verificar la validez del token
// 	jwt.verify( token, SEED, (err, decoded)=>{
// 		if ( err ) {
// 			return res.status(401).json({
// 				ok: false,
// 				message: 'Token inválido',
// 				errors: err
// 			});
// 		}

//		next();
// 	});
// });

