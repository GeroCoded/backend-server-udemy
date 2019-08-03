

// ~~~~~~~~~~~~~~~ Requires ~~~~~~~~~~~~~~ //
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// ~~~~~~~~ Inicializar variables ~~~~~~~~ //
var app = express();



// ~~~~~~~~~~~~~ Body Parser ~~~~~~~~~~~~~ //
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false})); 
// parse application/json
app.use(bodyParser.json());



// ~~~~~~~~~~~~ Importar rutas ~~~~~~~~~~~ //
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');



// ~~~~~ Conexión a la base de datos ~~~~~ //
// Quitar error: (node:13868) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true}).then( ()=> {
	console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
}).catch( (err)=> {
	if ( err ) throw err;
});

// Quitar error de: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);



// ~~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~ //
// Se crea un middleware
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// ~~~ Escuchar peticiones del express ~~~ //
app.listen(3000, ()=>{
	console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});


