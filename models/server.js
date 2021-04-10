

const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {

            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',// Con este codigo se ayuda a otra persona que quiera ver el codigo que esta es la ruta de usuarios


        };



        // Conectar a base de datos
        this.conectarDB();// Llamada del metodo conectar db

        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    };

    async conectarDB() { // Creacion del metodo conectarDB() dentro de mi clase server
        await dbConnection();
    };

    middlewares() {

        // CORS
        this.app.use(cors());


        // Lectura y parseo de body
        this.app.use(express.json())// Con este middleware obtenemos la informacion recibida y la pasamos a json

        this.app.use(express.static('public'))
    }

    routes() {

        // Middleware condicional
        this.app.use(this.paths.auth, require('../routes/auth.routes'))// Se recomienda poner el middleware del login primero,y el resto en orden alfabetico
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'))// Definiendo ruta del metodo
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'))// Definiendo ruta del metodo
        this.app.use(this.paths.productos, require('../routes/productos.routes'))// Definiendo ruta del metodo
        this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'))// Definiendo ruta del metodo



    }

    listen() {// Indicando metodo para configurar puerto del servidor
        this.app.listen(this.port, () => {
            console.log(`Todo bien en el puerto: ${'http://localhost:'.red} ${this.port.yellow}`.green)
        })
    }
}

module.exports = Server;// Esportamos clase