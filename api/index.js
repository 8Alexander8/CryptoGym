var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const WebSocket = require("ws");
const Entities = require("html-entities").AllHtmlEntities;

var apiCallObj = {};

//Coin API call for all coins (fron CoinCap)
apiCallObj.cryptoApi = function () {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.coincap.io/v2/assets", false);
  xhttp.send();
  const json_data = JSON.parse(xhttp.responseText);
  return json_data.data;
};

//single coin call by coin id name
apiCallObj.cryptoPriceBySymbol = function (coin) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.coincap.io/v2/assets/" + coin + "", false);
  xhttp.send();
  const json_data = JSON.parse(xhttp.responseText);
  console.log(json_data);
  return json_data.data.priceUsd;
};
//Get News Feed from CryptoCompare
apiCallObj.newsData = async function () {
  const entities = new Entities();
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=f979eea26e59bdefe68d50e04815a648f87ae1c0a4f37bb92564f937d57183c3",
    false
  );
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  const data = await entities.decode(xhttp.responseText);
  const news_data = await JSON.parse(data);
  console.log(news_data)
  return news_data.Data;
};

module.exports = apiCallObj;