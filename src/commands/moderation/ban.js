const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports ={

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) =>{
        const targetUserID = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'BAD!';

       await interaction.deferReply();
       
       const targetUser = await interaction.guild.members.fetch(targetUserID);

       if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server")
        return;
       }

       if (targetUserID === interaction.guild.ownerId) {
        interaction.editReply("You can't ban that user.");
        return;
       }

       const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
       const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
       const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
       
       if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply("You can't ban a user with a higher / same postion.")
        return;
       }

       if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply("Bot's position cannot be lower / same than target's");
        return;
       }

       //ban user
       
       try {
        
        await targetUser.ban({ reason });
        await interaction.editReply(`User ${targetUser} was banned \nReason: ${reason}`);

       } catch (error) {
        console.log(`there was an error banning that user ${error}`)
       }
    },

    name: 'ban',
    description: 'Bans A Member From A Server',
    devOnly: true,
    options: [
        {
            name: 'target-user',
            description: 'the user to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,

        },
        {
            name: 'reson',
            description: 'The reson for banning',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

}