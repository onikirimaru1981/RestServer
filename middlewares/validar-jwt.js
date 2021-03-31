const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');// leer el token de la request
    // Validacion de si existe token
    if (!token) {
        return res.status(401).json({// Si no viene token

            msg: 'No hay token en la peticion'
        })

    }

    // Validar si JWT es valido
    try {
        // const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);// Con el jwt.verify compruebo si el token es valido
        // Utilizando el payload podemos ver lo que nos devuelve y asi utilizar los datos que necesitemos
        // console.log(payload);
        //{ uid: '6064ef0c96e1781968a1bf8a', iat: 1617227707, exp: 1617256507 }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);// Comprueba que existe un usuario 

        // Verificar si el usuario del cual se utiliza el token parar borrar esta en la BD
        if (!usuario) {// Si el usuario no existe
            return res.status(401).json({

                msg: 'Token no valido-usuario no existe en la DB '
            })
        }


        // Verificar si el  usuario del cual se utiliza el token para borrar tiene estado en true o false,ya que un usuario borrado no deberia poder borrar

        if (!usuario.estado) {// Si el estado del usuario es false
            return res.status(401).json({

                msg: 'Token no valido-usuario con estado: false'
            })

        }

        // Con este codigo creamos una propiedad nueva en el objeto request
        req.uid = uid;
        req.usuario = usuario// Añadimos a la req el usuario con ese uid del cual se utiliza el token para poder borrar






        // req.usuario = usuario;// Con este codigo creamos una propiedad nueva en el request
        next()// instruccion para que siga con el siguiente middleware

    } catch (error) {

        console.log(error);
        res.status(401).json({

            msg: 'Token no valido'
        })

    }

};



module.exports = {

    validarJWT
};