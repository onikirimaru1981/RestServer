const { response, request } = require('express');



const validarArchivo = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {// Codigo para preguntar si en la propiedad req viene el archivo file,o el req.files.archivo
        res.status(400).json({ msg: 'No hay archivos que subir' });
        return;
    };
    next()

};

module.exports = {

    validarArchivo

};
