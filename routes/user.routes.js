
const { Router } = require('express');
const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete } = require('../controllers/user.controllers');

const router = Router();

// Peticiones 

router.get('/', usuariosGet)
router.put('/:id', usuariosPut)
router.post('/', usuariosPost)
router.patch('/', usuariosPatch)
router.delete('/', usuariosDelete)










module.exports = router;