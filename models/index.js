const Categoria = require('../models/categoria');
const Producto = require('../models/producto')
const Role = require('../models/role');
const Server = require('../models/server');
const Usuario = require('../models/usuario');


// Exportando cada modelo
module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
}