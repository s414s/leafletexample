export class WebSocketService {
    private ws: WebSocket;
    private messageCallback: (data: any) => void;

    constructor(url: string, onMessage: (data: any) => void) {
        this.ws = new WebSocket(url);
        this.messageCallback = onMessage;
        this.setupWebSocket();
    }

    private setupWebSocket() {
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.messageCallback(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    public sendMessage(data: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    public disconnect() {
        this.ws.close();
    }
}
