const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");

const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express(); // creo la app
    this.port = process.env.PORT; // seteo el puerto
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/users",
      categorias: "/api/categories",
      productos: "/api/products",
      buscar: "/api/search",
      uploads: "/api/uploads",
    };

    // Conexion DB
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicacion
    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // directorio publico
    this.app.use(express.static("public"));

    // Fileupload - carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  sockets() {
    this.io.on("connection", (socket) =>  socketController(socket, this.io))
  }

  listen() {
    // Escucho el server no el app
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
