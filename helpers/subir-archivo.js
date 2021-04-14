const path = require('path')// Requiriendo path para las rutas de la carpeta donde se alojaran los archivos
const { v4: uuidv4 } = require('uuid');// Libreria para generar identificadores unicos.



const subirArchivo = async (files, extensionesValidas = ['png', 'jpg', 'bmp', 'gif'], carpeta = '') => {// Ya que interesa trabajar con promesas para las respuestas,trabajaremos asi

    return new Promise((resolve, reject) => {

        // //                       Comprobacion de si se esta eniando un archivo o no

        // if (!files) {
        //     return reject(`No se ha seleccionado ningun archivo a enviar: ${files}`);

        // };

        const { archivo } = files;// desestructuro la req.files para obtener el archivo



        //                             Sacar extension de archivo

        const nombreCortado = archivo.name.split('.');// Separar nombre del string name por un punto
        const extension = nombreCortado[nombreCortado.length - 1];// Codigo para sacar la extension del archivo

        //                                      Validar extension

        if (!extensionesValidas.includes(extension)) {// Codigo para validar que el archivo contenga una extension valida
            return reject(`La extension: ${extension} no es valida. Extensiones permitidas: ${extensionesValidas}`);

        };


        // Subida de archivo
        const nombreTemp = uuidv4() + '.' + extension;// Codigo para generar nombre temporald el archivo subido
        const uploadPath = path.join(__dirname, '../uploads', carpeta, nombreTemp); // Codigo para contruccion del path donde quiero alojar ese archivo

        archivo.mv(uploadPath, (err) => {// Codigo que mueve el archivo a la carpeta indicada en el path
            if (err) {
                return reject(err)
            };

            // resolve('Archivo subido correctamente a ' + uploadPath);// Si todo se resuelve correctamente
            resolve(nombreTemp);
        });







    });







};

module.exports = {

    subirArchivo
};