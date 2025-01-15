const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { generateDependencyReport, createAudioPlayer, createAudioResource, StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const yts = require( 'yt-search' );
const path = require('path');
const fs = require("fs");


cookiesPath = path.join('src', 'utils', 'cookies.json');
cookiesContent = fs.readFileSync(cookiesPath, 'utf8');
agent = ytdl.createAgent(JSON.parse(cookiesContent));


const music_player = async (player, Qqueue, QvoiceCon, Qguild) =>{

  const getNextResource = () => {

    guild_queue.shift();
    music_player(player, Qqueue, QvoiceCon, Qguild);
  
  }

  const stopPlayer = () => {

    QvoiceCon.destroy();
    client_queue.delete(Qguild);
    console.log('Guild queue deleted.');

  }

  music_player.getNextResource = getNextResource;
  music_player.stopPlayer = stopPlayer;

  const client_queue = Qqueue;

  const guild_queue = client_queue.get(Qguild);
  const Qsong = client_queue.get(Qguild)[0];
      
  // if there is no songs destroy connection
  if (!Qsong){

    stopPlayer();
    
    return 0;

  };

  // attach player to voice connection
  QvoiceCon.subscribe(player);

  // create streamable file
  const stream = await ytdl(`${Qsong}`, {
    
    filter: 'audioonly',
  
    quality: 'highestaudio',
  
    agent,
  
    highWaterMark: 1 << 25,
    
    requestOptions: {
    headersTimeout: 1000 * 10, 
    bodyTimeout: 1000 * 10,  
    headers: {},
    referer: "https://www.youtube.com/",
    }, 
  });

  // play stream
  player.play(createAudioResource(stream, {seek: 0, volume: 1}));
  
  
  // switch songs when idle
  player.on(AudioPlayerStatus.Idle, () =>{

    getNextResource();

  })

  player.on(AudioPlayerStatus.AutoPaused, () => {

    stopPlayer();
  })


  // log errors with player
  player.on('error', error => {
    console.log(error);
  });


}




module.exports = {

  music_player,

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   * 
   */

  callback: async (client, interaction) => {


    const voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    await interaction.deferReply();

    var guild = interaction.guild.id;
    var searchOps = interaction.options.get('search').value;
    var int = interaction.options.get('search-type').value;
    var interaction_guild = interaction.guild.id;

    const client_queue = client.queue;
    const server_player = client.player;

    console.log(searchOps);
    console.log(int);
    
    // handle different search opts
    var song;
    switch (int) {
      case 1: {

        // AUTOMATIC SEARCHING WITH NAME

        const r = await yts(`${searchOps}`);
        const videos = r.videos.slice( 0, 3 );

        var song = videos[0].url;

        break;
      }

      case 2: {


        // SEARCH THROUGH YT-LINK
        if (ytdl.validateURL(`${searchOps}`) == true){
          
          // given url is a valid youtube link 
          var song = searchOps;
          
        } else{

          await interaction.editReply("Provided Youtube link isn't valid", { ephemeral: true });
          break;
        }

        break;
      }

      default:

        // Shouldn't ever happen but just to be sure
        await interaction.editReply('HOW?!? CONTACT ME @qwer22ajc', { ephemeral: true });
        break;
    }

    // find info about video
    const videoInfo = await ytdl.getInfo(song, agent);
    
    // Create answer embed using discord embedbuilder
    const ansEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`${videoInfo.videoDetails.title}`)
    .setURL(`${song}`)
    .setAuthor({ name: 'Qsound', iconURL: 'https://cdn.discordapp.com/attachments/1262170953538867371/1325829254566645792/trashcan_bochi.png?ex=677d3637&is=677be4b7&hm=011114fb979d6a9883403a47df3646eae36e5e9aa8221cf044ee3b2cb6d4694a&' })
    .setThumbnail(`${videoInfo.videoDetails.thumbnails[videoInfo.videoDetails.thumbnails.length - 1].url}`) 

    if (!client_queue.get(guild, [])){

      client_queue.set(guild, []);
      client_queue.get(guild).push(`${song}`);
      console.log(client_queue.get(guild));

      music_player(server_player, client_queue, voiceConnection, interaction_guild);

      ansEmbed.setDescription('▶️ playing.. ');
      return await interaction.editReply({ embeds: [ansEmbed] }, { ephemeral: false });

    } else{

      client_queue.get(guild).push(`${song}`);
      console.log(client_queue.get(guild));

      ansEmbed.setDescription('▶️ Queued up ');
      return await interaction.editReply({ embeds: [ansEmbed] }, { ephemeral: false });
    
    }
    
  },

  name: "play",
  description: "Play Music :D",
  options: [

    {
      name: "search",
      description: "Search form given name/Url",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'search-type',
      description: 'Pick desired search type',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        {

          name: "auto-search",
          description: "Searches from name",
          value: 1

        },
        {
          name: "yt-link",
          description: "Provided Youtube link",
          value: 2
        },
      ]
    },
  ]
}