import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
    lat: number;
    lng: number;
    name: string;
}

export class RandomCanvasMap {
    private map: L.Map;
    private points: Point[] = [];
    // private infoPanel: L.Control;
    private updateTimer: number | null = null;

    constructor(containerId: string) {
        this.map = L.map(containerId, {
            preferCanvas: true
        }).setView([39.8283, -98.5795], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // this.infoPanel = this.createInfoPanel();
        // this.infoPanel.addTo(this.map);
    }

    public startRandomUpdates(pointsPerUpdate: number = 1000): void {
        // Clear any existing timer
        if (this.updateTimer) {
            this.stopRandomUpdates();
        }

        // Set new timer
        this.updateTimer = window.setInterval(() => {
            const randomPoints: Point[] = [];
            for (let i = 0; i < pointsPerUpdate; i++) {
                randomPoints.push({
                    lat: 25 + Math.random() * 25,
                    lng: -120 + Math.random() * 60,
                    name: `Point ${this.points.length + i}`
                });
            }

            // Combine new points with existing points
            this.points = [...this.points, ...randomPoints];
            this.renderPoints();
        }, 1000); // 1 second
    }

    public stopRandomUpdates(): void {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    private renderPoints(): void {
        // Clear existing points from map
        this.map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                this.map.removeLayer(layer);
            }
        });

        // Add all points to map
        this.points.forEach(point => {
            L.circleMarker([point.lat, point.lng], {
                radius: 4,
                fillColor: '#ff4444',
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