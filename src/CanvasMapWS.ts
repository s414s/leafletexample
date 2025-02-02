import './style.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.vectorgrid';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// interface AtlasChangeEvent {
//     imei: string;
//     lat: number;
//     long: number;
//     color: string;
// }

// Contrato con el backend
interface Pt {
    imei: string;
    lat: number;
    lng: number;
    c: 'R' | 'G';
}

export class CanvasMapWS {
    private map: L.Map;
    //private points: Point[] = [];
    private interid: number = 0;
    // private newPointsToRender: Point[] = [];

    //private allPts = new Map<string, Pt>();
    private allPts: Map<string, L.CircleMarker<any>> = new Map<string, L.CircleMarker<any>>();;
    // private allPts: Map<string, Pt> = new Map<string, Pt>();;

    // WS
    private connection: HubConnection;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    constructor(containerId: string, url: string) {
        // if (this.counter === 0) clearInterval(intervalId);

        // Initialize the map with canvas rendering
        this.map = L.map(containerId, { preferCanvas: true })
            // .setView([39.8283, -98.5795], 4)
            .setView([41.6488, -0.8891], 8);

        L.tileLayer.wms(
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            {
                subdomains: 'abcd',
                maxZoom: 23,
            },
        ).addTo(this.map);

        L.tileLayer.wms('https://gis.cayc.es/wms/cayc_general', {
            layers: 'parcel_public_perimeter',
            transparent: true,
            format: 'image/png',
            version: '1.1.1',
            //  width: 256,
            // height: 256,
            crs: L.CRS.EPSG4326,
            maxZoom: 23
        }).addTo(this.map);

        L.tileLayer.wms('https://gis.cayc.es/wms/cayc_general', {
            layers: 'parcel_public',
            transparent: true,
            format: 'image/png',
            version: '1.1.1',
            crs: L.CRS.EPSG4326,
            // width: 256,
            // height: 256,
            maxZoom: 23
        }).addTo(this.map);

        L.tileLayer.wms('https://gis.cayc.es/wms/cayc_general', {
            layers: 'irrigationnetwork,irrigationshed',  // Multiple layers separated by comma
            transparent: true,
            format: 'image/png',
            version: '1.3.0',
            // width: 208,
            // height: 983,
            // tiled: false,
            crs: L.CRS.EPSG4326,
            maxZoom: 23
        }).addTo(this.map);

        // WS
        this.connection = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        // Set up event handlers
        this.connection.on('ReceiveMessage', (message: string) => {
            this.notifyListeners('message', message);
        });

        this.connection.on('SendStateChange', (change: Pt) => {
            console.info("->SendStateChange", change);

            // this.notifyListeners('stateChange', change);
            this.addPts([change]);
        });

        this.connection.on('InitializeState', (points: Pt[]) => {
            console.info("->InitializeState", points);

            this.addPts(points);


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

    public getViewPortData(): void {
        const size = this.map.getSize();
        console.log("Size", size);

        const centerCoords = this.map.getCenter();
        console.log("CenterCoord", centerCoords);

        const bounds = this.map.getBounds();
        console.log("Bounds", bounds);

        // const boundsEast = bounds.getEast();
        // const boundsWest = bounds.getWest();

        const zoomLevel = this.map.getZoom();
        console.log("zoomLevel", zoomLevel);
    }

    public setView(center: L.LatLngExpression, zoom: number): void {
        this.map.setView(center, zoom);
    }

    public clearPoints(): void {
        this.map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                this.map.removeLayer(layer);
            }
        });
    }

    public startRefresh(): void {
        const ms = 2000;

        this.interid = setInterval(() => {
            this.clearPoints();
            this.renderPts();
        }, ms);
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

    // public async sendStateChange(change: AtlasChangeEvent): Promise<void> {
    //     try {
    //         await this.connection.invoke('SendStateChange', change);
    //     } catch (err) {
    //         console.error('Error sending state change:', err);
    //         throw err;
    //     }
    // }

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
            eventListeners.forEach((callback: any) => callback(data));
        }
    }

    private addPts(points: Pt[]): void {
        for (const point of points) {

            const circle = L.circleMarker([point.lat, point.lng], {
                radius: 4,
                fillColor: point.c === "R" ? '#ff4444' : '#44ff44',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            this.allPts.set(point.imei, circle);
        }

        console.log("NUMBER OF ENTRIES", this.allPts.size);
    }

    private renderPts(): void {
        this.allPts.forEach(c => { c.addTo(this.map); });
        this.getViewPortData();
    }

    public isConnected(): boolean {
        return this.connection.state === 'Connected';
    }
}

// const defaultLayer = '../../movallibs/js/moval_gis_viewer_layer_control/imgs/default.svg';
//windo.namespacesUrls.set('infotable', '../../movallibs/js/moval_gis_viewer_layer_infotable/locales/{{lng}}.json');

//     layersToCreate.forEach((layer) => {
//         window[layer.varName] = window.L.tileLayer.wms(
//             'https://icearagon.aragon.es/AragonFotos',
//             {
//                 layers: layer.leafletName,
//                 format: 'image/png',
//                 transparent: true,
//                 crs: window.L.CRS.EPSG4326,
//                 maxZoom: 23,
//             },
//         );
//         // eslint-disable-next-line no-undef
//         window[`${layer.varName}Object`] = new BaseLayer({
//             name: layer.name,
//             active: false,
//             map: map,
//             leafletLayer: window[layer.varName],
//             varName: `${layer.varName}Object`,
//             picture: '../../movallibs/js/moval_gis_viewer_layer_control/imgs/default.svg',
//             year: layer.year,
//         });
//         aragonBaseLayers.push(window[`${layer.varName}Object`]);
//     });

//     return aragonBaseLayers;
// }
