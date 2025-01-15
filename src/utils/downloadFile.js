const axios = require('axios');


async function downloadFile () {  
    
    const res = await axios.get(url, {
        responseType: "text",
        responseEncoding: "base64",
      });
      
      const base64 = Buffer.from(res.data, "base64");
      const sfattach = new Discord.MessageAttachment(base64, "output.png");
    
}

module.exports = { downloadFile };