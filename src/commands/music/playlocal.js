const { createAudioResource } = require('@discordjs/voice');
const { ApplicationCommandOptionType } = require('discord.js');

// NOT WORKING!!! WIP

module.exports ={
    callback: (client, interaction) =>{
        
        const guild = interaction.guild.id;

        const client_player = client.player;
        const client_queue = client.queue;

        var file = interaction.options.get('file');
        console.log(file)
        console.log('-------------------------------')
        console.log(file.attachment);
        var resource = createAudioResource(createReadStream());

        console.log(resource);
    
    },

    name: 'playlocal',
    description: 'play provided local file then continues with queue',
    options: [
        {
            name: "file",
            description: "Drop File Here",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        }
    ],
    required: true,
    testOnly: true
}