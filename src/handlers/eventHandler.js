const path = require('path')
const getAllFlies = require("../utils/getAllFlies")

module.exports = (client) =>{

    // Get all files from events folder
    const eventFolders = getAllFlies(path.join(__dirname, '..', 'events'), true);
    
    // Loop trough all event files and sort them
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFlies(eventFolder);
        eventFiles.sort((a, b) => a > b);

        // Only get the name of the file (not the path)
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()

        // Handle events
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles){
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }
        });
    }
};