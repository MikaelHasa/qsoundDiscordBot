const { music_player } = require("./play");

module.exports ={
    name: 'stop',
    description: 'Stop current player',

    callback: (client, interaction) =>{
        
        music_player.stopPlayer();

        interaction.reply({content: `stopped!`,});
        
        setTimeout(() => {
            interaction.deleteReply();
        }, 2000);

    }
}