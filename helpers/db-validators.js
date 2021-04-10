// Centrando el validador de role
const mongoose = require('mongoose');
const { Categoria, Producto, Usuario, Role } = require('../models');






const esRoleValido = async (rol = '') => {// En caso de que la peticion viniera vacia en el campo rol,dejariamos por defecto un string vacio

    const existeRol = await Role.findOne({ rol });// Si rol existe significaria que esta grabado en la base de datos
    if (!existeRol) {
        throw new Error(`El rol: ${rol} no esta registrado en la base de datos`)// Si no existiera rol mandariamos un error perzonalizado al custom

    }

}



const emailExiste = async (correo = '') => {

    const existeCorreo = await Usuario.findOne({ correo });// Si correo existe significaria que esta grabado en la base de datos

    if (existeCorreo) {
        throw new Error(`El correo: ${correo} ya esta registrado,utilice otro diferente`)// Si no existiera rol mandariamos un error perzonalizado al custom

    }

}


const existeUsuarioPorId = async (id = '') => {

    if (mongoose.Types.ObjectId.isValid(id)) {

        const { estado } = await Usuario.findById(id);

        if (!estado) {
            throw new Error(`El id  ${id}  no existe en la BD`);
        }
    } else {
        throw new Error(`El id ${id} no es válido`);
    }




}



// Crear middleware existeCategoria

const existeCategoriaPorId = async (id = '') => {

    if (mongoose.Types.ObjectId.isValid(id)) {

        const { estado } = await Categoria.findById(id);

        if (!estado) {
            throw new Error(`El id: ${id} no existe en la BD`);
        }
    } else {
        throw new Error(`El id ${id} no es válido`);
    }




};
// Crear middleware existeProducto

const existeProductoPorId = async (id = '') => {

    if (mongoose.Types.ObjectId.isValid(id)) {

        const { estado } = await Producto.findById(id);
        if (!estado) {
            throw new Error(`El id: ${id} no existe en la BD`);
        }
    } else {
        throw new Error(`El id ${id} no es válido`);
    }


};










module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,





}