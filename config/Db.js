// config/Db.js
const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.green(`MongoDB Connected: ${conn.connection.host}`));
    } catch (error) {
        console.log(chalk.red.bold(`Error: ${error.message}`));
        process.exit(1);
    }
};

module.exports = connectDB;
