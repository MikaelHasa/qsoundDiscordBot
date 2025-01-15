const path = require('path');
const getAllFlies = require('./getAllFlies');

module.exports = (exceptions = []) =>{
    let localCommands = [];

    const commandCategories = getAllFlies(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const commandCategory of commandCategories ) {
        const commandfiles = getAllFlies(commandCategory);

        for (const commandFile of commandfiles){
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) {
                continue;
            }
            localCommands.push(commandObject);
        }
    }

    return localCommands;
};