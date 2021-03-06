// Importando middlewares de forma clasica

// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

// Importando middlewares de forma mas elegante

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole } = require('../middlewares')

const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios.controllers');




const router = Router();

// Peticiones 

router.get('/', [
    check('limit', 'No es un numero').not().isNumeric()//hhjhjhj
], usuariosGet);


router.put('/:id', [
    check('id',).custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'El password debe contener como minimo 6 caracteres').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    validarCampos

], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').custom(emailExiste).isEmail(),// Utilizando dos validadores en una sola linea
    check('password', 'El password debe contener como minimo 6 caracteres').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);


router.patch('/', usuariosPatch);


router.delete('/:id', [

    validarJWT,// El primer middleware deberia ser el del JWT para si fallara no se ejecutara nada mas
    // esAdminRole,// Este middleware fuerza a que el usuario tenga que ser administrador
    // tieneRole('ADMIN_ROLE', 'USER_ROLE'),// Middleware mas flexible para los roles
    // check('id', 'No es un ID valido').isMongoId().custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);










module.exports = router;