const { response, request } = require('express');
const bcryptjs = require('bcryptjs');// Requiriendo paquete para encriptar contraseñas
// grabar en DB
const Usuario = require('../models/usuario');

// Controladores

//lista de usuarios
const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'No name', apikey } = req.query;
    //Paginacion

    const { limit = 5, page = 1 } = req.query;// Recogiendo query del usuario
    const query = { estado: true };
    const { offset, hasPrevPage, hasNextPage, prevPage, pagingCounter, ...cuerpoReq } = await Usuario.paginate({}, { limit, page });// Utilizando metodo .paginate() de (mongoosePaginate);
    // const usuarios = await Usuario.find(query);
    const { totalDocs: documentosTotales, totalPages: paginasTotales, nextPage: proximaPagina, page: paginaActual } = cuerpoReq;
    // const UsuariosTotales = await Usuario.countDocuments(query);

    const [totalUsuarios, usuarios] = await Promise.all([// Pendiente:implementar la promesa paginate
        Usuario.countDocuments(query),
        Usuario.find(query)
    ])

    // .skip(Number(desde))// Estableciendo desde donde va a paginar
    // .limit(Number(limite));// Estableciendo limite
    res.json({
        msg: 'Listado de usuarios',
        totalUsuarios,
        paginasTotales,
        paginaActual,
        proximaPagina,
        usuarios,


    });

};


// Obtener datos de un POST
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar contraseña(hacer el hash)
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);


    // Guardar en BD el registro
    await usuario.save();
    res.json({

        msg: 'Usuario creado y guardado correctamente',
        usuario
    });
};

const usuariosPut = async (req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, rol, ...resto } = req.body// Codigo para extraer parametros que podrian causar que nuestro codigo falle 
    //TODO: validar contra BD
    if (password) {// Si el password existe lo encriptara
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }
    //Codigo para actualizar con el metodo findByIdAndUpdate
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })// La opcion new true devuelve ya el dato actualizado
    res.status(202).json({

        msg: 'Actualizacion realizada con exito',
        usuario
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({

        msg: 'patch API - controlador'
    });
};


const usuariosDelete = async (req, res = response) => {

    let { id } = req.params;
    // const uid = req.uid;// De esta forma extraemos el uid de la request,que anteriormente habiamos introducido en el validar-jwt.js

    // Borrado fisico

    // const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado sin perder dato
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
    // usuarioAutenticado = req.usuario// Requiriendo el usuario autenticado de la req,que anteriormente habiamos asignado,este usuario es al que se le asigno el token


    res.json({

        msg: `usuario con uid:${id} ha sido borrado correctamente`,
        usuario,
        // usuarioAutenticado
        // uid



    });
};





module.exports = {

    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}






