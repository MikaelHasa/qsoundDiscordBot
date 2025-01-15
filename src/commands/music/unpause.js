module.exports ={
    name: 'unpause',
    description: 'continue current song',
    devOnly: true,

    callback: (client, interaction) =>{
        
        const player = client.player;

        player.unpause();
        interaction.reply('continuing!');
        
        setTimeout(() => {
            interaction.deleteReply();
        }, 2000);

    }
}