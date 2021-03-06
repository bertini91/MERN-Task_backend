const express = require("express");
const conectDB = require("./config/db");
const cors = require("cors");

//Creamos el servidor
const app = express();

//Conectar a la DB
conectDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ express: true }));

//Puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use("/api/usuarios", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/project"));
app.use("/api/tareas", require("./routes/task"));

//Arrancamos la app
app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});
