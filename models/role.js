// Creando modelo role para apoyarse enBD con  para mas tarde validarlo
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es ogligatorio']


    }


});



module.exports = model('Role', RoleSchema);