// Conexion de mongoose con DB
const mongoose = require('mongoose');// Requiriendo el paquete mongoose
require('colors')

const dbConnection = async () => {// Creadno funcion de conexion

    // Sintaxis para conexion de DB con mongoose
    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            // opciones que se necesitan
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false// Esta opcion nos sirve para utilizar ciertas funciones,con lo cual es recomendable ponerlo
        });
        console.log('Base de datos online'.green);



    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos'.red);

    };



}


module.exports = {
    dbConnection
}