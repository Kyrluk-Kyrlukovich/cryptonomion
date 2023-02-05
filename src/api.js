const API_KEY = '154edae0836abebfb744393dc2ceeb33e6f53b9c0a36250bba6e9a4ef31ad48d';

const tickersHandlers = new Map;
const socket = new  WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGGREGATE_INDEX = "5";
let conversionCurrency = 'USD';

socket.addEventListener("message", e => {
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, MESSAGE: message} = JSON.parse(e.data);
    console.log(e);
    if(newPrice === undefined) {
        return;
    }
    let valid = false;
    const handlers = tickersHandlers.get(currency) ?? [];
    type === AGGREGATE_INDEX ? valid = true : valid;
    handlers.forEach(fn => fn(newPrice, valid));
})

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message)

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
        return;
    }

    socket.addEventListener("open", () => {
        socket.send(stringifiedMessage)
    }, { once:true });
}

function subscribeToTickerOnWb(ticker) {
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~BTC`, `5~CCCAGG~BTC~USD`]
    })
}

function unsubscribeFromTickerOnWb(ticker) {
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~BTC`, `5~CCCAGG~BTC~USD`]
    })
}

export const subcribeToTickers = (ticker, cb) => {
    const subcribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subcribers, cb])
    subscribeToTickerOnWb(ticker);
}

export const unsubcribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
    unsubscribeFromTickerOnWb(ticker)
}


window.tickers = tickersHandlers;