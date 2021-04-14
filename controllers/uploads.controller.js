const path = require('path');
const fs = require('fs')
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');
const cloudinary = require('cloudinary').v2;// Requiriendo libreria cloudinary
cloudinary.config(process.env.CLOUDINARY_URL);// Configurando cuenta para cloudinary(de esta forma autenticamos el backend con cloudinary)


const cargarArchivo = async (req, res = response) => {

    //                                Trabajamos con try/catch para manejar el error si lo hubiera
    try {

        // Imagenes
        // utilizando la funcion subir archivo de los helpers y mandando la req.files como argumento para esta,tener en cuenta que ya que en la funcion mandamos los argumentos
        // a fuerza,ponemos el undefined para que los tenga en cuenta en la funcion subirArchivo
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        // Txt,md
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');// De esta forma definimos las extensiones que queremos que sean validas a la hora de subir archivos

        res.json({ msg: `Archivo subido satisfactoriamente: ${nombre}` });

    } catch (msg) {
        res.status(400).json({ msg });
    };

};

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;// Definimos modelo con let porque mas tarde asignaremos la variable
    try {


        switch (coleccion) {
            case 'usuarios':// Validador de si el id de usuario existe en la DB

                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
                };
                break;
            case 'productos':// Validador de si el id de producto existe en la DB

                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
                };
                break;

            default:
                return res.status(500).json({ msg: ' Se me olvido validar esto' });
        };

        //                            Limpiar imagenes previas
        if (modelo.img) {

            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);// Codigo para definir la ruta del archivo (Nota:coleccion corresponde al nombre de la coleccion)

            if (fs.existsSync(pathImagen)) {// Codigo pata comprobar si existe ya la imagen

                fs.unlinkSync(pathImagen)// Al existir la imagen esta sera borrada
            };
        };

    } catch (error) {

        res.status(500).json(error)

    };


    // Subida de archivos y guardado en carpeta con el nombre de la coleccion, teniendo en cuenta si es usuarios o productos
    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();// Grabado de la imagen en el usuario,o producto correspondiente

    res.json(modelo);
};


const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;
    try {

        switch (coleccion) {
            case 'usuarios':

                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
                };
                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
                };
                break;

            default:
                return res.status(500).json({ msg: ' Se me olvido validar esto' });
        };


        if (modelo.img) {

            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                //Mostrar imagen
                return res.sendFile(pathImagen)// A diferencia del caso del put,en este caso lo que queremos es enviar la imagena  mostrar
            };
        }


        // Codigo para mostrar imagen por defecto si el producto o usuario no tiene imagen guardada
        const pathImagen = path.join(__dirname, '../assets', '../assets/no-image.jpg');

        return res.sendFile(pathImagen)

        // res.json({ msg: 'Falta el place holder' })

    } catch (error) {

        res.status(500).json(error)

    };

};



const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;// Definimos modelo con let porque mas tarde asignaremos la variable
    try {


        switch (coleccion) {
            case 'usuarios':// Validador de si el id de usuario existe en la DB

                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
                };
                break;
            case 'productos':// Validador de si el id de producto existe en la DB

                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
                };
                break;

            default:
                return res.status(500).json({ msg: ' Se me olvido validar esto' });
        };

        //                            Limpiar imagenes previas
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');// codigo para obtener un nuevo areglo de los elementos separados por slash :"https://res.cloudinary.com/onikirimaru1981/image/upload/v1618443438/rdwdrhgoqcrwjgzdxotw.jpg"
            const nombre = nombreArr[nombreArr.length - 1];// Obteniendo la ultima pocision de ese areglo
            const [public_id] = nombre.split('.');// Obteniendo nuevo areglo  de los elementos separados por un punto y extrayendo el id de la imagen de cloudinary,ene ste caso seleccionamos del areglo la primera posicion ya que la segunda seria el jpg
            cloudinary.uploader.destroy(public_id);// Eliminando el archbivo anterior almacenado en cloudinary
            // console.log(public_id);


        };
        const { tempFilePath } = req.files.archivo;// Extrayendo de la req la ruta temporal del archivo/imagen
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)// Asignandole a la funcion upload el path temporal del archivo y extrayebdo la url de la imagen

        modelo.img = secure_url;

        await modelo.save();// Grabado de la imagen en el usuario,o producto correspondiente

        res.json(modelo);

    } catch (error) {

        res.status(500).json(error)

    };

    // Subida de archivos y guardado en carpeta con el nombre de la coleccion, teniendo en cuenta si es usuarios o productos

    // const nombre = await subirArchivo(req.files, undefined, coleccion);

};




module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen

};