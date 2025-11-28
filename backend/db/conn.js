const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin_user:HByRyPKXzGTP3hjV@cluster0.kwgkubb.mongodb.net/?appName=Cluster0"
    );
    console.log("Conectado ao Banco de Dados - MongoDB");
  } catch (error) {
    console.log("Erro ao conectar no MongoDB:", error);
  }
}


main();
module.exports = mongoose;
