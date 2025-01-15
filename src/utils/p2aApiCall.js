const axios = require('axios');
const FormData = require('form-data');


async function apiCall(image, styleInt) {
	
  //given data to api
	const data = new FormData;
	data.append('url', `${image}`);
	data.append('style', `${styleInt}`);

  //api opts
	const options = {
		method: 'POST',
		url: 'https://phototoanime1.p.rapidapi.com/photo-to-anime',
		headers: {
			'x-rapidapi-key': `${RAPIDAPIKEY}`,
			'x-rapidapi-host': 'phototoanime1.p.rapidapi.com',
			...data.getHeaders(),
		},
		data: data
	};

	try {
    //get response from api
		const response = await axios.request(options);
		console.log(response.data);

    //get only imageUrl form response
		string = JSON.stringify(response.data);
		let obj = JSON.parse(string);
		let imageURL = obj.body.imageUrl;

    //debuggin :D
		console.log('-----loggin return------');
		console.log(obj);
		console.log(imageURL);

    //return imageUrl
		return imageURL;

	} catch (error) {
		console.error(error);
	}
}

module.exports = { apiCall };