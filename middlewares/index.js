const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');


// Exportando cada validador utilizando el operador spread
module.exports = {
    ...validarCampos,// Con esta sintaxis puedo exportar todo lo que tenga validarCampos,y asi con el resto de validadores
    ...validarJWT,
    ...validarRoles
}