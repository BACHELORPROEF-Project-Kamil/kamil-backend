const mongoose = require('mongoose');
// Ik gebruik mongoose om meer structuur te krijgen in mijn database.
// Stel er word een getal gestuurd naar een tekstveld, accepteerd mongoose dit niet en krijg ik een error.
// Ik zorg er eigenlijk voor dat er geen of ongeldige data in mijn database terecht komt.

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error while connecting to database: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;