
const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const FormData = require('form-data');
const { apiCall } = require('../../utils/p2aApiCall');


module.exports = {

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) => {

    await interaction.deferReply({ ephemeral: false });
    let kuva = interaction.options.getAttachment('photo');
    let int = interaction.options.get('style').value;
    let kuvaUrl = kuva.url + '.jpg'

    //image opts cases
    let imgStyl;
    switch (int) {
      case 1: {

        //Face2Paint
        console.log(1);
        imgStyl = 'face2paint';
        break;

      }

      case 2: {

        //Paprika
        console.log(2);
        imgStyl = 'paprika';
        break;

      }

      case 3: {

        //WebToon
        console.log(3);
        imgStyl = 'webtoon';
        break;

      }

      default: {

        await interaction.editReply('How tf?!?, Boy u broke something', { ephemeral: true });

      }

    }


    const response = await apiCall(kuvaUrl, imgStyl);

    //create a buffer that streams image from download link
    const res = await axios.get(response, {
      responseType: "text",
      responseEncoding: "base64",
    });

    const base64 = Buffer.from(res.data, "base64");
    const sfattach = new AttachmentBuilder(base64, { name: "output.png" });

    //answer user
    await interaction.editReply({ files: [sfattach] }, { ephemeral: false });

  },

  name: 'ai-photo',
  description: 'Convert given photo to anime',
  options: [

    {
      name: "photo",
      description: "kuva :D",
      type: ApplicationCommandOptionType.Attachment,
      required: true
    },
    {
      name: "style",
      description: "Pick A Style",
      required: true,
      type: ApplicationCommandOptionType.Integer,
      choices: [

        {
          name: "f2p",
          description: "Face2Paint",
          value: 1
        },
        {
          name: "paprika",
          description: "Paprika :D",
          value: 2
        },
        {
          name: "webtoon",
          description: "WebToon Style",
          value: 3
        }
      ]

    }
  ]
}