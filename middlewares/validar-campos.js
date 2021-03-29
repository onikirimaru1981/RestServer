const { validationResult } = require('express-validator');


// Sintaxis para mostrar resultado de validacion en caso de que hubieran errores por parte de express-validation
const validarCampos = (req, res, next) => {// Next es lo que tengo que llamar si la funcion pasa el if

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();// El nex se ejecutara si todo va correctamente,y si hay otro middleware lo ejecutara y sino ira al controller

}


module.exports = {
    validarCampos
}