const express = require("express");
const cors = require("cors");
const app = express();
const conn = require("./db/conn");
const routes = require("./routes/router")

app.use(cors());
app.use(express.json());

conn();
// Inicia o servidor!
app.listen(3000, function () {
  console.log(`Servidor Online!`);
});
