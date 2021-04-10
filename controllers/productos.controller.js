const { response, request } = require('express');
const { Producto } = require('../models');
const usuario = require('../models/usuario');

// obtenerproductos - paginado - total - populate(mantener ultimo usuario y categoria a la que pertenece el producto que ha modificado el registro)

const productosGet = async (req = request, res = response) => {
    // Recogiendo query del usuario
    const { limit, page } = req.query;

    // Query para estado productos
    const query = { estado: true };

    // Opciones paginate
    const opcionesPaginate = {
        sort: { categoria: "asc" },
        populate: { path: 'usuario categoria', select: 'nombre nombre' },
        limit,
        page
    };

    // Promise.all para mejorar la velocidad de la respuesta
    let [paginado, productosTotales] = await Promise.all([// Pendiente:implementar la promesa paginate
        Producto.paginate(query, opcionesPaginate),
        Producto.countDocuments(query),

    ]);

    // Extrayendo parametros que necesarios para la rest


    let { totalPages: paginasTotales, nextPage: proximaPagina, page: paginaActual, docs: productos } = paginado;
    if (proximaPagina === null) {
        proximaPagina = 'No hay mas paginas'

    }



    // Respuesta
    res.json({

        msg: 'Listado de productos',
        productosTotales,
        paginasTotales,
        paginaActual,
        proximaPagina,
        productos,


    });

};


// obtenerProducto - populate{objeto de la Producto}
const productoGet = async (req, res = response) => {
    const productoId = req.params.id;

    const { estado, nombre, _id: id, usuario: creado_por, categoria: categoriaCreada_por, precio, disponible, descripcion } = await Producto.findById(productoId).populate({ path: 'usuario categoria', select: 'nombre nombre' });


    if (!estado) {
        res.status(400).json(
            {
                msg: `La Producto con el nombre: ${nombre} que intenta solicitar ya no existe  en la DB`

            })
    }

    res.status(200).json({

        msg: `Producto con id: ${id}`,
        nombre,
        precio,
        disponible,
        descripcion,
        creado_por,
        categoriaCreada_por

    });


};
// Metodo creacion Producto

const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body

    try {
        const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

        if (productoDB) {// Comprobar si existe nombre de Producto
            return res.status(400).json({

                msg: `El producto: ${productoDB.nombre}  ya existe en la DB`
            });

        };
        // Generar la data a guardar

        const data = {
            ...body,// Resto de parametros en body
            nombre: body.nombre.toUpperCase(),// Convirtiendo nombre en mayusculas
            usuario: req.usuario._id,// usuario que crea el producto,id del token

        }

        // Instanciando la clase Producto y añadiendole la data

        const producto = await new Producto(data);
        // Guardar DB

        await producto.save();
        res.status(201).json({

            msg: 'Producto Creado correctamente',
            producto
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Pongase en contacto con el administrador'
        });

    }


};

// Actualizar Producto
const productoPut = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...body } = req.body

    if (body.nombre) {
        body.nombre = body.nombre.toUpperCase();
    }

    body.usuario = req.usuario._id

    // //Codigo para actualizar con el metodo findByIdAndUpdate
    const producto = await Producto.findByIdAndUpdate(id, body, { new: true })// La opcion new true devuelve ya el dato actualizado

    res.status(202).json({

        msg: 'Actualizacion realizada con exito',
        producto
    });


};


// Borrar Producto - estado:false
const productoDelete = async (req, res = response) => {

    let { id } = req.params;

    //Borrado sin perder dato

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json({

        msg: `La Producto: ${productoBorrado.nombre} con id: ${id} ha sido borrado correctamente`


    });


};



module.exports = {
    crearProducto,
    productosGet,
    productoGet,
    productoPut,
    productoDelete


};