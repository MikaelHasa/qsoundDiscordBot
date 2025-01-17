module.exports = async (client, guildID) =>{
    let applicationCommands;

    if (guildID) {
        const guild = await client.guilds.fetch(guildID);
        applicationCommands = guild.commands;
    } else {
        application = await client.application.commands;
    }

    await applicationCommands.fetch();
    return applicationCommands;
}