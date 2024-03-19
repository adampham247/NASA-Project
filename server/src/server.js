const http = require('http');

const app = require('./app');

const {loadPlanetsData} = require('./models/planet_model')

const PORT = process.env.PORT || 8000 ;

const server = http.createServer(app);
/*
We need await loadPlanetsData(). After finish loading data, the server will run.
To await to work, we have to put it in async function.
*/
async function startServer(){
    await loadPlanetsData();

    server.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();

