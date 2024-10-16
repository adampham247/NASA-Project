const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://adampham247:thien123@nasa.3xg2ber.mongodb.net/'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready')
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}