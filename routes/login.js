var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

	var body = req.body;

	Usuario.findOne({ correo: body.correo }, (err, usuarioDB)=>{
		

		if( err ) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				errors: err
			});
		}

		// El usuario no existe
		if ( !usuarioDB ) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas #correo',
				errors: {
					message: 'Credenciales incorrectas #correo'
				}
			});
		}

		if ( !bcrypt.compareSync( body.password, usuarioDB.password )) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas #password',
				errors: {
					message: 'Credenciales incorrectas #password'
				}
			});
		}

		// ------ Crear TOKEN ----- //
		usuarioDB.password = ':)';
		var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

		
		res.status(200).json({
			ok: true,
			usuario: usuarioDB,
			token: token,
			id: usuarioDB.id
		});
	});
	
});

module.exports = app;