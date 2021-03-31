const jwt = require('jsonwebtoken');

//                                                   Sintaxis para generar JWT
const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {// /Ya que lo deseable es que generarJWT trabaje en base a promesas,utilizamos esta sintaxis

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '8h'  // Tiempo de expiracion del token 
        }, (err, token) => {
            if (err) {

                console.log(err);
                reject('No se pudo generar el token')

            } else {

                resolve(token);
            }

        })

    })


};



module.exports = { generarJWT }