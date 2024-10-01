const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const {loadPlanetsData} = require('./models/planet_model')

const PORT = process.env.PORT || 8000 ;

const MONGO_URL = 'mongodb+srv://adampham247:thien123@nasa.3xg2ber.mongodb.net/'

const server = http.createServer(app);
/*
We need await loadPlanetsData(). After finish loading data, the server will run.
To await to work, we have to put it in async function.
*/

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready')
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();

