const { query } = require('express');
const launchesDatabase = require('./launch_mongo')
const planets = require('./planet_mongo')
const axios = require('axios')

const DEFAULT_FLIGHT_NUMBER = 100;


const SPACEX_API_URL_QUERY = 'https://api.spacexdata.com/v4/launches/query';
const SPACEX_API_URL_LASTEST = 'https://api.spacexdata.com/v4/launches/latest'

async function loadLaunchData(){   
    
    
    try {
        const DatabaseSXflightNumber = await launchesDatabase
        .findOne()
        .sort('-SXflightNumber');
        console.log("Database" + DatabaseSXflightNumber);

        if (
            (!DatabaseSXflightNumber)
            || 
            (DatabaseSXflightNumber.SXflightNumber == null)
        ){    
            populateData();  
        }

        else
        {
            const respond = await axios.get(SPACEX_API_URL_LASTEST);
            const latestSXflightNumber = respond.data.flight_number;
            
            console.log("From SpaceX" + latestSXflightNumber);
            if (latestSXflightNumber < DatabaseSXflightNumber.SXflightNumber ){
                console.log("Updating")
                populateData();
                
            }
            else{
                console.log('No new flights from SpaceX');
            }
        }
    }
    catch(error){
        console.log(error);
    }
}       

async function populateData(){
    console.log("Downloading");
    const response = await axios.post(SPACEX_API_URL_QUERY,{
        query: {} ,
        options: {
            pagination: false,
            populate:[
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) =>{
            return payload['customers'];
        })
        const launch = {
            SXflightNumber : launchDoc['flight_number'],
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,
        }
        // console.log(`${launch.SXflightNumber} ${launch.mission}`);
        await saveLaunchSX(launch);
    }
}


async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne().sort('-flightNumber');

    if (!latestLaunch)
    {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
return await launchesDatabase
.find({},{'_id': 0,'__v': 0})
.sort({flightNumber: 1})
.skip(skip)
.limit(limit);
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber: launchId,
    })
}

async function saveLaunch(launch){

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch,{
        upsert: true,
    })
}
async function saveLaunchSX(launchSX){

    await launchesDatabase.findOneAndUpdate({
        SXflightNumber: launchSX.SXflightNumber,
    }, launchSX,{
        upsert: true,
    })
}

async function scheduleNewLaunch(launch){
    
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet){
        throw new Error('No matching planet found')
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Elon', 'NASA'],
        flightNumber: newFlightNumber,
        SXflightNumber: null,
    })

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    })
    console.log(aborted)
    return aborted;

}

module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
    loadLaunchData,
}