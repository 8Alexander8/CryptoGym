const pricesWs = new WebSocket(
    "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin,maker,bitcoin-cash,bitcoin-sv,dash,litecoin,zcash,digixdao"
);
var onmessageFinish = false;
pricesWs.onmessage = function (msg) {

    if (onmessageFinish == false) {
        onmessageFinish = true;
        obj = JSON.parse(msg.data);
        console.log(obj);
        for (i in obj) {
            let price = parseFloat(obj[i]).toFixed(2);
            if ($("#" + i + "").html() < price) {
                $("#" + i + "").text(parseFloat(obj[i]).toFixed(2));
                $("#" + i + "").effect(
                    "highlight", {
                        color: "#669966",
                    },
                    1000
                );
            } else if ($("#" + i + "").html() > price) {
                $("#" + i + "").text(parseFloat(obj[i]).toFixed(2));
                $("#" + i + "").effect(
                    "highlight", {
                        color: "#996666",
                    },
                    1000
                );
            }
        }
        onmessageFinish = false;
    }
};
window.onbeforeunload = function () {
    pricesWs.onclose = function () {}; // disable onclose handler first
    pricesWs.close();
};