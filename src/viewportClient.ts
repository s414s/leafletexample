import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface Pt {
    name: string;
    lat: number;
    lng: number;
    c: 'R' | 'G';
}

interface AtlasChangeEvent {
    imei: string;
    lat: number;
    long: number;
    color: string;
}

export class ViewportClient {
    private connection: HubConnection;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    constructor(url: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        // Set up event handlers
        this.connection.on('ReceiveMessage', (message: string) => {
            this.notifyListeners('message', message);
        });

        this.connection.on('SendStateChange', (change: AtlasChangeEvent) => {
            console.info("->SendStateChange", change);

            this.notifyListeners('stateChange', change);
        });

        this.connection.on('InitializeState', (points: Pt[]) => {
            console.info("->InitializeState", points);

            this.notifyListeners('initialize', points);
        });

        // Handle connection state changes
        this.connection.onclose((error) => {
            this.notifyListeners('connectionState', { connected: false, error });
        });

        this.connection.onreconnecting((error) => {
            this.notifyListeners('connectionState', { connected: false, reconnecting: true, error });
        });

        this.connection.onreconnected((connectionId) => {
            this.notifyListeners('connectionState', { connected: true, connectionId });
        });
    }

    public async connect(): Promise<void> {
        console.info("CONNECTINGGGGGG");
        try {
            await this.connection.start();
            this.notifyListeners('connectionState', { connected: true });
        } catch (err) {
            console.error('Error starting connection:', err);
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.connection.stop();
        } catch (err) {
            console.error('Error stopping connection:', err);
            throw err;
        }
    }

    public async sendMessage(message: string): Promise<void> {
        try {
            await this.connection.invoke('SendMessage', message);
        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    }

    public async sendStateChange(change: AtlasChangeEvent): Promise<void> {
        try {
            await this.connection.invoke('SendStateChange', change);
        } catch (err) {
            console.error('Error sending state change:', err);
            throw err;
        }
    }

    public on(event: string, callback: (data: any) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            const eventListeners = this.listeners.get(event);
            if (eventListeners) {
                eventListeners.delete(callback);
            }
        };
    }

    private notifyListeners(event: string, data: any): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    public isConnected(): boolean {
        return this.connection.state === 'Connected';
    }
}