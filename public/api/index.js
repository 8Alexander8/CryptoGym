var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const WebSocket = require("ws");

var apiCallObj = {};

//Coin API call for all coins (fron CoinCap)
apiCallObj.cryptoApi = function () {

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "https://api.coincap.io/v2/assets",
    false
  );
  xhttp.send();
  const json_data = JSON.parse(xhttp.responseText);
  return json_data.data;
};

//single coin call by coin id name
apiCallObj.cryptoPriceBySymbol = function (coin) {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "https://api.coincap.io/v2/assets/" + coin + "",
    false
  );
  xhttp.send();
  const json_data = JSON.parse(xhttp.responseText);
  console.log(json_data)
  return json_data.data.priceUsd;
}





module.exports = apiCallObj;