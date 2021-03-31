const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


//                                                                      Validacion login usuario

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Pasword no son correctos-correo'
            });
        };

        //Comprobar si el user esta en mi base de datos
        if (!usuario.estado) {// Si usuario.estado es false
            return res.status(400).json({
                msg: 'Usuario / Pasword no son correctos-estado:false'
            });
        };

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);// Metodo compareSyn es util para comparar el password de nuestra bd con el de la peticion de login
        if (!validPassword) {
            return res.status(400).json({

                msg: 'Usuario - Password no son correctos - passsword'
            })

        }

        // Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Token generado satisfactoriamente',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Pongase en contacto con el administrador'
        });
    };








}



module.exports = {

    login
}