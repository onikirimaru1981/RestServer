// Creando modelo categoria para apoyarse en BD con para mas tarde validarlo
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategoriaSchema = Schema({
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
    usuario: {// Codigo para saber que usuario creo esa categoria

        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

CategoriaSchema.methods.toJSON = function () {// Tener en cuenta que en este caso debe ser una funcion normal
    const { __v, estado, ...data } = this.toObject();// Quitando lo que no quiero que se incluya en la data

    return data;
};

CategoriaSchema.plugin(mongoosePaginate);



module.exports = model('Categoria', CategoriaSchema);