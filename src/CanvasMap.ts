import './style.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
    lat: number;
    lng: number;
    name: string;
    c: string;
}

export class CanvasMap {
    private map: L.Map;
    private points: Point[] = [];
    // private infoPanel: L.Control;
    private interid: number = 0;

    constructor(containerId: string) {
        // Initialize the map with canvas rendering
        this.map = L.map(containerId, {
            preferCanvas: true
        }).setView([39.8283, -98.5795], 4);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Initialize info panel
        // this.infoPanel = this.createInfoPanel();
        // this.infoPanel.addTo(this.map);
    }

    public addPoints(points: Point[]): void {
        this.points = points;
        this.renderPoints();
    }

    public startReadingGrains(): void {
        this.interid = setInterval(() => {
            fetch("http://localhost:5118/getAllPoints")
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                    this.clearPoints();
                    this.points = x;
                    this.renderPoints();
                })
                .catch(x => console.error(x));
        }, 1000);
    }

    public startInterval(): void {
        this.interid = setInterval(() => {
            // if (this.counter === 0) clearInterval(intervalId);

            const randomPoints: Point[] = [];
            for (let i = 0; i < 10000; i++) {
                randomPoints.push({
                    lat: 25 + Math.random() * 25,
                    lng: -120 + Math.random() * 60,
                    name: `Point ${i}`,
                    c: "R",
                });
            }

            this.clearPoints();
            this.points = randomPoints;
            this.renderPoints();

        }, 1000);

    }

    public addRandomPoints(count: number): void {
        const randomPoints: Point[] = [];
        for (let i = 0; i < count; i++) {
            randomPoints.push({
                lat: 25 + Math.random() * 25,
                lng: -120 + Math.random() * 60,
                name: `Point ${i}`,
                c: "R",
            });
        }

        this.addPoints(randomPoints);
    }

    private renderPoints(): void {
        this.points.forEach(point => {

            L.circleMarker([point.lat, point.lng], {
                radius: 4,
                fillColor: point.c === "R" ? '#ff4444' : '#44ff44',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
                .bindPopup(point.name)
                .addTo(this.map);
        });

        this.updateInfoPanel();
    }

    // private createInfoPanel(): L.Control {
    //     const info = L.control();

    //     info.onAdd = () => {
    //         const div = L.DomUtil.create('div', 'info-panel');
    //         this.updateInfoPanelContent(div);
    //         return div;
    //     };

    //     return info;
    // }

    private updateInfoPanel(): void {
        const div = document.querySelector('.info-panel');
        if (div) {
            this.updateInfoPanelContent(div as HTMLElement);
        }
    }

    private updateInfoPanelContent(div: HTMLElement): void {
        div.innerHTML = `
            <h4>Points Demo</h4>
            Click on any point to see its name<br>
            Total points: ${this.points.length}
        `;
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
        this.points = [];
        this.updateInfoPanel();
    }
}