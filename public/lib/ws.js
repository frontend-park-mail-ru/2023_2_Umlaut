export class WebSocketWrapper {
    constructor(webSocketURL) {
        this.url = webSocketURL;
        this.messageSubscribers = new Set();
        this.closeSubscribers = new Set();
        this.errorSubscribers = new Set();
    }

    connect() {
        console.log('Try to connect');
        const connectionState = this.socket?.readyState;
        if (connectionState === WebSocket.OPEN || connectionState === WebSocket.CONNECTING) {
            console.log('Already connected');
            return;
        }
        try {
            this.socket = new WebSocket(this.url);
        } catch (e) {
            console.log('not connected');
        }
        this.socket.onopen = () => {
            console.log('Socket connected');
        };
        this.socket.onmessage = (event) => {
            this.messageSubscribers.forEach((handler) => {
                handler(event.data);
            });
        };
        this.socket.onclose = (event) => {
            console.log('Socket closed');
            this.closeSubscribers.forEach((handler) => {
                handler(event);
            });
            if (event.wasClean === false) {
                setTimeout(this.connect.bind(this), 1000);
            }
        };
        this.socket.onerror = (event) => {
            this.errorSubscribers.forEach((handler) => {
                handler(event);
            });
        };
    }

    disconnect() {
        if (this.socket) {
            console.log('Try to close socket');
            const connectionState = this.socket?.readyState;
            if (connectionState === WebSocket.CLOSED || connectionState === WebSocket.CLOSING) {
                console.log('Already closed');
                return;
            }
            this.socket.close();
        }
    }

    subscribe(eventType, handler) {
        switch (eventType) {
        case 'message':
            this.messageSubscribers.add(handler);
            break;
        case 'close':
            this.closeSubscribers.add(handler);
            break;
        case 'error':
            this.errorSubscribers.add(handler);
            break;
        default:
            break;
        }
    }

    send(dataObject) {
        try {
            this.socket.send(JSON.stringify(dataObject));
        } catch (e) {
            e;
            throw e;
        }
    }
}
