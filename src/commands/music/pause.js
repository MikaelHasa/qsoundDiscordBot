
module.exports ={
    name: 'pause',
    description: 'Pause Player',
    devOnly: true,

    callback: async (client, interaction) =>{

        const player = client.player;
        player.pause();
        interaction.reply('Paused!');
        
        setTimeout(() => {
            interaction.deleteReply();
        }, 2000);
        
    }
}