const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const googleVerify = require('../helpers/google-verify');


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


};

//                                 Google Signin

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;
    try {
        // const googleUser = await googleVerify(id_token);
        const { correo, nombre, img } = await googleVerify(id_token);

        // verificar si el correo ya existe en la BD

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Si no existe se crea usuario 
            const data = {// Data que necesito grabar
                nombre,
                correo,
                password: ':P',
                img,
                google: true

            };
            usuario = new Usuario(data);// De esta forma agrefamos la data a usuarios
            await usuario.save();

        }
        // else{} si ya existe(por hacer)

        // Si elñ usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({

                msg: 'Contacte con el administrador: Usuario bloqueado'
            })

        }

        // Generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Token generado satisfactoriamente',
            usuario,
            token
        });




        //                         Codigo mantenido a modo de recordatorio

        // console.log(googleUser);// Llegados a este punto podemos saber si el usuario de google es retornado correctamente

        // res.json({

        //     msg: 'Todo ok! Google Signin',
        //     googleUser
        //     // id_token
        // })


    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido',
            // id_token
        });

    }

}



module.exports = {

    login,
    googleSignin
}