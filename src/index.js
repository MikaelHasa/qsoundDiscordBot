require('dotenv/config');
const { Client, IntentsBitField, Collection } = require ('discord.js');
const eventHandler = require('./handlers/eventHandler');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
        
    ],
});

client.queue = new Map();

client.player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
    debug: true
});


eventHandler(client);


client.on('rateLimit', (data) => {
    console.warn(`Rate limiting in effect`, data);
});


client.login(process.env.TOKEN);