const mongoose = require('mongoose');
require('dotenv').config();

async function connect(){
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Db connecte!');
}

module.exports = {
    connect
};