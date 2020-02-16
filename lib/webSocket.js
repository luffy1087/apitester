import WS from 'ws';

class WebSocket {
    constructor() {
        this.ws = new WS('wss://127.0.0.1');
        this.ws.on('open', () => console.log('Connection is estrablished'));
    }
    
    on(evtString, callback) {
        this.ws.on(evtString, callback);
    }

    send(data) {
        this.ws.send(data);
    }
}

export default new WebSocket();