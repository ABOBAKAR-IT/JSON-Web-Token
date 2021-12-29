var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://airport-info.p.rapidapi.com/airport',
  headers: {
    'x-rapidapi-host': 'airport-info.p.rapidapi.com',
    'x-rapidapi-key': 'b81e99f3dfmshd4b2f402360186bp168597jsnd2084cb54b0e'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});