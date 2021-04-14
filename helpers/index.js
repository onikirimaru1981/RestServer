const dbValidators = require('./db-validators');
const generarJwt = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivos = require('./subir-archivo')// Exportando cada validador utilizando el operador spread



module.exports = {
    ...dbValidators,
    ...generarJwt,
    ...googleVerify,
    ...subirArchivos

};