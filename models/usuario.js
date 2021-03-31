
// Modelo de datos del usuario
// {
//     nombre: 'ewewe',
//     correo: 'fdfdfff',
//     password: '12122ddsd121221',
//     img: 'sdfsfdsffs',
//     rol: '33232323233232',
//     estado: false,
//     google: false

// }


const { Schema, model } = require('mongoose');// Clase y metodo requerido de mongooose para crear modleo de usuario
const mongoosePaginate = require('mongoose-paginate-v2');



const UsuarioSchema = Schema({// El nombre va siempre en mayusculas



    // Datos del usuario




    nombre: {
        type: String,// Definimos de que tipo sera el dato
        required: [true, 'El nombre es obligatorio']// Definimos que este campo es obligatorio,y si encerramos el true,o el false entre corchetes podemos añador mensaje en caso de que no definan este campo
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true// Con este codigo decimos que el correo es unico con lo cual no se podra repetir
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String// La imagen sera una url,por eso es tipo string
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        emun: ['ADMIN_ROLE', 'USER_ROLE']// Con el emun controlamos los dos unicos tipos de roles admitidos

    },
    estado: {
        type: Boolean,
        default: true// Con el default conseguimos que cuando un usuario este creado este por defecto en true
    },
    google: {// Verificar si el usuario fue creado con google
        type: Boolean,
        default: false
    },




});
UsuarioSchema.plugin(mongoosePaginate);

//                                         Metodos sobreescritos o nuevos


// Codigo para eliminar datos de la respuesta,y devolver el resto ,sobreescribiendo el metodo toJSON()
UsuarioSchema.methods.toJSON = function () {// Tener en cuenta que en este caso debe ser una funcion normal
    const { __v, password, _id, correo, ...usuario } = this.toObject();
    usuario.uid = _id;// Codigo para cambiar visualmente el _id por uid
    // usuario.email = correo;
    return usuario;
}


//                    nombre BD    nombre Schema 
module.exports = model('Usuario', UsuarioSchema);//El nombre de la coleccion siempre debe ser en singular,ya que mongoose lo pondra en prural al crear la BD