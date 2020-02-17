import WS from 'ws';

//Server should be used to send messages to client
//Should need to attach event in order to exetute steps with client data
class WebSocket {
    constructor() {
        this.ws = new WS.Server({ port: 7788 });
        this.ws.on('connection', (ws) => this.onConnection)
        this.ws.on('error', console.error);
    }
    
    on(evtString, callback) {
        this.ws.on(evtString, callback);
    }

    send(data) {
        this.ws.send(data);
    }

    onConnection(ws) {
        ws.on()
    }
}

export default new WebSocket();