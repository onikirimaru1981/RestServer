const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();

// Peticiones 

// Ruta login

router.post('/login', [

    check('correo', 'El correo es obligatorio').isEmail(),
    // check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);//Controlador login

// Ruta Google Sign

router.post('/google', [
    check('id_token', 'El id token es necesario').not().isEmpty(),// Error personalizado
    validarCampos
], googleSignin);// Controlador google signin


module.exports = router;