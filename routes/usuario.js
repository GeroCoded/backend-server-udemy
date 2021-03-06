var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Usuario = require('../models/usuario');

// ~~~~~~~~~~~~~~~~ RUTAS ~~~~~~~~~~~~~~~~ //

// ====================================================== //
// ================= Listado de Usuarios ================ //
// ====================================================== //
app.get('/', (req, res, next )=>{

	Usuario.find({}, 'nombre correo img role')
		.exec( (err, usuarios)=>{
			if ( err ) {
				return res.status(500).json({
					ok: false,
					message: 'Error cargando usuarios',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				usuarios: usuarios
			});
		});
});



// ====================================================== //
// ================= Actualizar Usuario ================= //
// ====================================================== //
app.put('/:id', mdAuthentication.verificaToken, (req, res)=>{

	var id = req.params.id;
	var body = req.body;

	Usuario.findById( id, (err, usuario)=>{


		// Aquí entra en caso de que el id no tenga un formato correcto (24 caracteres)
		if( err ) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				errors: err
			});
		}

		// El usuario no existe
		if ( !usuario ) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe el usuario con el id ' + id,
				errors: {
					message: 'No existe un usuario con ese ID'
				}
			});
		}

		usuario.nombre = body.nombre;
		usuario.correo = body.correo;
		usuario.role = body.role;

		usuario.save( (err, usuarioGuardado)=> {
			if( err ) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al actualizar usuario',
					errors: err
				});
			}

			usuarioGuardado.password = ':)';

			return res.status(200).json({
				ok:true,
				usuario: usuarioGuardado,
				usuarioToken: req.usuarioToken

			});
		});
	});
});


// ====================================================== //
// =============== Crear un nuevo Usuario =============== //
// ====================================================== //
app.post('/', mdAuthentication.verificaToken, (req, res)=>{
	var body = req.body;

	var usuarioACrear = new Usuario({
		nombre: body.nombre,
		correo: body.correo,
		password: bcrypt.hashSync(body.password, 10),
		img: body.img,
		role: body.role,
	});

	usuarioACrear.save( (err, usuarioGuardado)=>{
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
			usuarioToken: req.usuarioToken
		});
	});

});

// ====================================================== //
// =============== Eliminar Usuario por ID ============== //
// ====================================================== //

app.delete('/:id', mdAuthentication.verificaToken, (req, res)=>{

	var id = req.params.id;

	Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
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
				mensaje: 'No existe el usuario con el id ' + id,
				errors: {
					message: 'No existe un usuario con ese ID'
				}
			});
		}

		res.status(200).json({
			ok: true,
			usuario: usuarioBorrado,
			usuarioToken: req.usuarioToken
		});
	});
});


module.exports = app;