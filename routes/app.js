var express = require('express');

var app = express();

// Rutas
app.get('/', (req, res, next )=>{
	res.status(404).json({
		ok: true,
		message: 'Petición realizada correctamente'
	});
});

module.exports = app;