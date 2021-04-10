const { response, request } = require('express');
const { Categoria } = require('../models');


// obtenerCategorias - paginado - total - populate(mantener ultimo usuario que ha modificado el registro)

const categoriasGet = async (req = request, res = response) => {
    // Recogiendo query de la categoria
    const { limit, page } = req.query;

    // Query para estado de categoria
    const query = { estado: true };

    // Opciones paginate
    const opcionesPaginate = {
        sort: { nombre: 1 },
        populate: { path: 'usuario', select: 'nombre' },
        limit,
        page
    };

    // Promise.all para mejorar la velocidad de la respuesta
    let [paginado, categoriasTotales] = await Promise.all([
        Categoria.paginate(query, opcionesPaginate),
        Categoria.countDocuments(query),

    ]);
    // Extrayendo parametros que necesarios para la rest
    let { totalPages: paginasTotales, nextPage: proximaPagina, page: paginaActual, docs: categorias } = paginado;
    if (proximaPagina === null) {
        proximaPagina = 'No hay mas paginas'

    }
    // Respuesta
    res.json({

        msg: 'Listado de categorias',
        categoriasTotales,
        paginasTotales,
        paginaActual,
        proximaPagina,
        categorias
    });

};


// obtenerCategoria - populate{objeto de la categoria}
const categoriaGet = async (req, res = response) => {
    const categoriaId = req.params.id;
    const { estado, nombre, _id: id, usuario: creada_por } = await Categoria.findById(categoriaId).populate('usuario', 'nombre');

    if (!estado) {
        res.status(400).json(
            {
                msg: `La categoria con el nombre: ${nombre} que intenta solicitar ya no existe  en la DB`

            })
    }

    res.status(200).json({

        msg: `Categoria con id: ${id}`,
        nombre,
        creada_por

    });


};
// Metodo creacion categoria

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();// Devolver categorias en mayusculas


    try {
        const categoriaDB = await Categoria.findOne({ nombre });// Ecnocntrar nombre y guardado en const

        if (categoriaDB) {// Comprobar si existe nombre de categoria
            return res.status(400).json({

                msg: `La cagoria: ${categoriaDB.nombre} ya existe`
            });

        };

        // Generar la data a guardar los parametros deseados en categoria

        const data = {
            nombre,
            usuario: req.usuario._id
        }


        // Instanciando la clase Categoria y añadiendole la data

        const categoria = await new Categoria(data);


        // Guardar DB

        await categoria.save();
        res.status(201).json({

            msg: 'Categoria Creada correctamente',
            categoria
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Pongase en contacto con el administrador'
        });

    }


};

// Actualizar categoria
const categoriaPut = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body


    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id// Dueño del toquen que se esta usando


    //Codigo para actualizar con el metodo findByIdAndUpdate
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })// La opcion new true devuelve ya el dato actualizado
    res.status(202).json({

        msg: 'Actualizacion realizada con exito',
        categoria,
    });


};




// Borrar categoria - estado:false
const categoriaDelete = async (req, res = response) => {

    let { id } = req.params;

    //Borrado sin perder dato

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({

        msg: `La categoria: ${categoriaBorrada.nombre} con id: ${id} ha sido borrada correctamente`

    });


};



module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGet,
    categoriaPut,
    categoriaDelete


};