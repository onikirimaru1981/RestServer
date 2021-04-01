const { response } = require("express");

const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    const { rol, nombre } = req.usuario

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({

            msg: `${nombre} no es administrador - No puede realizar esta tarea`
        })

    }


    next()

};
const tieneRole = (...roles) => {// Alojando todos los roles que me lleguen como argumento a roles
    return (req, res = response, next) => {
        // console.log(roles, req.usuario.rol);// Imprimiendo roles,y comprobando el rol del usuario
        if (!req.usuario) {// Comprobacion de si se incluye el jwt
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }
        // Comprobar si el usuario tiene alguno de los roles requeridos para la accion

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({

                msg: `El servicio requiere uno de estos roles:${roles}`
            })

        }
        next();
    }




}




module.exports = { esAdminRole, tieneRole }