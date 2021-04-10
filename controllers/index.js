const auth = require('../controllers/auth.controller');
const buscar = require('../controllers/buscar.controller');
const categorias = require('../controllers/categorias.controller');
const productos = require('../controllers/productos.controller');
const usuarios = require('../controllers/usuarios.controllers');


// Exportando cada validador utilizando el operador spread
module.exports = {
    ...auth,
    ...buscar,
    ...categorias,
    ...productos,
    ...usuarios,

}