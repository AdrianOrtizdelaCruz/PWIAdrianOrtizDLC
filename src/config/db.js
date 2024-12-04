const mongoose = require("mongoose");

// URI de conexión a MongoDB
const MONGO_URI = "mongodb://localhost:3000/teamDatabase"; // Para una base local
// O para MongoDB Atlas:
// const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Salir del proceso si la conexión falla
  }
};

module.exports = connectDB;
