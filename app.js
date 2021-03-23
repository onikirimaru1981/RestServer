const Server = require("./models/server");// Requerimos modelo donde esta nuestro server configurado
require('dotenv').config();// requiriendo librerias de 3º
require('colors')// requiriendo librerias de 3º


const server = new Server();// instanciando clase para luego utilizarla


server.listen()// Utilizacion metodo listen



