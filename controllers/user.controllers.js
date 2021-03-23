const { response, request } = require('express');


// Controladores


const usuariosGet = (req = request, res = response) => {


    const { q, nombre = 'No name', apikey } = req.query;
    res.status(400).json({

        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });
};

// Obtener datos de un POST
const usuariosPost = (req, res = response) => {


    const { nombre, edad } = req.body;

    res.json({

        msg: 'post API - controlador',
        nombre,
        edad
    });
};

const usuariosPut = (req, res = response) => {

    const id = req.params.id;
    res.status(202).json({

        msg: 'put API - controlador',
        id
    });
};

const usuariosPatch = (req, res = response) => {
    res.status(500).json({

        msg: 'patch API - controlador'
    });
};


const usuariosDelete = (req, res = response) => {
    res.json({

        msg: 'delete API - controlador'
    });
};


// Exportar controladores
module.exports = {

    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}






