// Creando modelo categoria para apoyarse en BD con para mas tarde validarlo
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es ogligatorio'],
        unique: true

    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },
    usuario: {

        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {

        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: String, default: true },
    img: { type: String }

});

ProductoSchema.methods.toJSON = function () {// Tener en cuenta que en este caso debe ser una funcion normal
    const { __v, estado, ...data } = this.toObject();// Quitando lo que no quiero que se incluya en la data

    return data;
};

ProductoSchema.plugin(mongoosePaginate);



module.exports = model('Producto', ProductoSchema);