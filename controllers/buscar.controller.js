const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');


let coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

// implementar en futuro buscar que productos tienen cada categoria:db.getCollection('productos').find({categoria:ObjectId('607064d8744c0a4c181459f2')})



const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);// TRUE
    // Validacion de si el id que se manda es de mongo
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []// Si el id no fuera correcto devolveria null,con este ternario devolvemos
            // un areglo vacio en caso de que no lo encuentre,en caso contrario devuelve el valor
        });
    };
    //Busqueda por parametros
    const regexp = new RegExp(termino, 'i');// Expresion regular utilizando RegExp de JS para que la busqueda sea insensible a las mayusculas y minusculas
    const usuarios = await Usuario.find({
        $or: [{ nombre: regexp }, { correo: regexp }],// Opcion de mongo para poner varias siatuaciones que deseamos que evalue operador or
        $and: [{ estado: true }]// Y tambien debe cumplir esta condicion operador and
    });
    const numeroResultados = await Usuario.count({
        $or: [{ nombre: regexp }, { correo: regexp }],// Opcion de mongo para poner varias siatuaciones que deseamos que evalue operador or
        $and: [{ estado: true }]// Y tambien debe cumplir esta condicion operador and
    });



    res.json({
        resultados: numeroResultados,
        results: usuarios
    });

};
const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);// TRUE
    // Validacion de si el id que se manda es de mongo
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []// Si el id no fuera correcto devolveria null,con este ternario devolvemos
            // un areglo vacio en caso de que no lo encuentre,en caso contrario devuelve el valor
        });
    };
    //Busqueda por parametros
    const regexp = new RegExp(termino, 'i');// Expresion regular utilizando RegExp de JS para que la busqueda sea insensible a las mayusculas y minusculas
    const categorias = await Categoria.find({ nombre: regexp, estado: true });
    const numeroResultados = await Usuario.count({
        $or: [{ nombre: regexp }],// Opcion de mongo para poner varias siatuaciones que deseamos que evalue operador or
        $and: [{ estado: true }]// Y tambien debe cumplir esta condicion operador and
    });



    res.json({
        resultados: numeroResultados,
        results: categorias
    });

};
const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);// TRUE
    // Validacion de si el id que se manda es de mongo
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []// Si el id no fuera correcto devolveria null,con este ternario devolvemos
            // un areglo vacio en caso de que no lo encuentre,en caso contrario devuelve el valor
        });
    };
    //Busqueda por parametros
    const regexp = new RegExp(termino, 'i');// Expresion regular utilizando RegExp de JS para que la busqueda sea insensible a las mayusculas y minusculas
    const productos = await Producto.find({ nombre: regexp, estado: true }).populate('categoria', 'nombre');
    const numeroResultados = await Producto.count({
        $or: [{ nombre: regexp }],// Opcion de mongo para poner varias siatuaciones que deseamos que evalue operador or
        $and: [{ estado: true }]// Y tambien debe cumplir esta condicion operador and
    });



    res.json({
        resultados: numeroResultados,
        results: productos
    });

};

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params// Extrayendo parametros 

    if (!coleccionesPermitidas.includes(coleccion)) {// Comprobacion si usuario incluye en los parametros las colecciones permitidas
        return res.status(400).json({
            msg: `Error: '${coleccion}'.No es una de las colecciones permitidas,estas son: ${coleccionesPermitidas}`
        });
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);

            break;
        case 'categorias':
            buscarCategorias(termino, res);

            break;
        case 'productos':
            buscarProductos(termino, res);

            break;
        default:
            res.status(500).json({

                msg: 'Se me olvido hacer esta busqueda'
            });
    };



};


module.exports = {

    buscar
}