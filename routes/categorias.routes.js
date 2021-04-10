const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, categoriasGet, categoriaGet, categoriaPut, categoriaDelete } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');

// Crear middleware para validar id


const router = Router();
/**
 * {{url}}/api/categorias
 */


// Obtener todas las categorias - Publico
router.get('/', [
    // validarJWT,
    validarCampos
], categoriasGet);

// Obtener una categoria - Publico
router.get('/:id', [
    // validarJWT,

    check('id').custom(existeCategoriaPorId),
    validarCampos

], categoriaGet);


// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id',).custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPut);




// Borrar una categoria - privado - Admin 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId().custom(existeCategoriaPorId),
    validarCampos
], categoriaDelete);



module.exports = router;