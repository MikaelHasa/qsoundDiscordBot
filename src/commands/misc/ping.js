module.exports ={
    name: 'ping',
    description: 'Answer With Pong! and show latency',
    devOnly: true,

    callback: (client, interaction) =>{
        interaction.reply(`Pong! ${client.ws.ping}ms`)

    }
}