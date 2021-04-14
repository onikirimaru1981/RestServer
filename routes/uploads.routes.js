const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarJWT, validarCampos, validarArchivo } = require('../middlewares');




const router = Router();


router.post('/', [
    validarJWT,
    validarArchivo,
    validarCampos
], cargarArchivo);

router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivo, // Comprobacion para saber si existe archivo para subir
    check('id', 'Id incorrecto. Introduzca un id de mongoDB valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),// Check personalizado para comprobar colecciones permitidas
    validarCampos
], actualizarImagenCloudinary);
//  actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'Id incorrecto. Introduzca un id de mongoDB valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);




module.exports = router;