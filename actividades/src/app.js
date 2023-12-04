import express from "express";
import productRouter from "./routes/products.routers.js";
import cartRouter from "./routes/carts.router.js";

import handlebars from "express-handlebars";
import viewRouter from "./routes/views.router.js";
import __dirname from "./utils/utils.js";

// socket server
import {Server} from "socket.io"

const app = express ();
//cambiar por products
const users = [];

const PORT = 8080;

// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);



const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//instanciar websocket

const socketServer = new Server(httpServer);

// Configuramos el engine
app.engine(
    "hbs",
    handlebars.engine({
      // index.hbs
      extname: "hbs",
      defaultLayout: false, 
    })
  );
// Seteamos nuestro motor
app.set("view engine", "hbs");
app.set("views", `src/views`);

// Public
app.use(express.static(`src/public`));


//socket communication
socketServer.on('connection',(socketClient) => {
  console.log("Nuevo cliente conectado");

  socketClient.on('message', (data) => {
    console.log(data);
  });

  socketClient.emit('server_message', "Mensaje desde el servidor");

  // mensaje del form

socketClient.on('form_message', (data) => {
  console.log(data);
  users.push(data);
  socketServer.emit('users_list', users);
});

socketServer.emit('users_list', users);

});



