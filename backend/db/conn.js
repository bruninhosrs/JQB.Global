const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://brunorodrigues398_db_user:oca015p6DVOPZG8X@cluster0.kwgkubb.mongodb.net/?appName=Cluster0"
    );
    console.log("Conectado ao Banco de Dados - MongoDB");
  } catch (error) {
    console.log("Erro ao conectar no MongoDB:", error);
  }
}
 

module.exports = main; 
