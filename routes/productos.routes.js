const { Router } = require('express');
const { check } = require('express-validator');
const { productosGet, productoGet, productoPut, crearProducto, productoDelete } = require('../controllers/productos.controller');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { response, request } = require('express')

// Crear middleware para validar id


const router = Router();
/**
 * {{url}}/api/productos
 */


// Obtener todas las productos - Publico
router.get('/', [
    // validarJWT,
    validarCampos
], productosGet);

// Obtener una producto - Publico
router.get('/:id', [
    validarCampos
], productoGet);


// Crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,// De aqui viene el req.usuario._id
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);


// Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], productoPut);


// Borrar una producto - privado - Admin 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId().custom(existeProductoPorId),
    validarCampos
], productoDelete);



module.exports = router;