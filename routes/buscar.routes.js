const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth.controller');
const { buscar } = require('../controllers');
const { validarCampos } = require('../middlewares');


const router = Router()


router.get('/:coleccion/:termino', buscar)



module.exports = router;
