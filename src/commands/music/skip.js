const { music_player } = require("./play");

module.exports ={
    name: 'skip',
    description: 'Skip Current Song',

    callback: async (client, interaction) =>{

        await interaction.deferReply({ ephemeral: false });
        
        const guild = interaction.guild.id;

        const server_queue = client.queue;

        if (!server_queue.get(guild)[1]){

            await interaction.editReply('No songs in queue');
            return;

        }else{

            try {

                music_player.getNextResource();
                await interaction.editReply('Skipped');
                
                setTimeout(() => {
                    interaction.deleteReply();
                }, 2000);
                
            } catch (err) {
                console.log(`error!: ${err}`)
                
            }
            

        }

    }
}