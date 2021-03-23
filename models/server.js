

const express = require('express');
var cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios';// Con este codigo se ayuda a otra persona que quiera ver el codigo que esta es la ruta de usuarios


        this.middlewares();
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use(cors());


        // Lectura y parseo de body
        this.app.use(express.json())// Con este middleware obtenemos la informacion recibida y la pasamos a json

        this.app.use(express.static('public'))
    }

    routes() {

        // Middleware condicional
        this.app.use(this.usuariosPath, require('../routes/user.routes'))// Definiendo ruta del metodo
    }

    listen() {// Indicando metodo para configurar puerto del servidor
        this.app.listen(this.port, () => {
            console.log(`Todo bien en el puerto: ${'http://localhost:'.red} ${this.port.yellow}`.green)
        })
    }
}

module.exports = Server;// Esportamos clase