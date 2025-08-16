const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const useAtlas = process.env.USE_ATLAS === 'true';
    const mongoURI = useAtlas
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL;

    if (!mongoURI) {
      throw new Error('Mongo URI is not defined in .env');
    }

    const conn = await mongoose.connect(mongoURI); // ✅ No extra options needed

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Mongo error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
