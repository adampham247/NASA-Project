const launches = new Map();

let lastestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('April 20, 2024'),
    target: 'Kepler-442 b',
    customer: ['Elon','Adam','NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);



function getAllLaunches() {
return Array.from(launches.values());
}

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

function addNewLaunch(launch){
    lastestFlightNumber++;
    launches.set(
        lastestFlightNumber, 
        Object.assign(launch,{
            success: true,
            upcoming: true,
            customer: ['Elon', 'NASA'],
            flightNumber: lastestFlightNumber
        })
    )
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}