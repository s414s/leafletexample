import './style.css';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.vectorgrid';
import { Feature } from 'geojson-vt';

interface Point {
    lat: number;
    lng: number;
    name: string;
    c: string;
}

type MapLayer = {
    name: string;
    leafletName: string;
    varName: string;
    year: number;
};

interface VectorTileOptions {
    vectorTileLayerStyles: {
        [key: string]: L.PathOptions;
    };
    subdomains: string;
    maxNativeZoom: number;
    minZoom: number;
    maxZoom: number;
    bounds?: L.LatLngBounds;
}

// Define the type for our feature properties
interface FeatureProperties {
    id: string;
    // Add other properties that your GeoJSON features might have
}

export class CanvasMap {
    private map: L.Map;
    private points: Point[] = [];
    // private infoPanel: L.Control;
    private interid: number = 0;
    private randomPoints: Point[] = [];

    private newPointsToRefresh: Point[] = [];

    constructor(containerId: string) {
        // if (this.counter === 0) clearInterval(intervalId);

        const latMin = 41.7; // Minimum latitude
        const latMax = 41.89; // Maximum latitude
        const lngMin = 0.2715; // Minimum longitude
        const lngMax = 0.39; // Maximum longitude

        // Function to generate a random number between min and max
        const getRandomInRange = (min: number, max: number) => min + Math.random() * (max - min);

        for (let i = 0; i < 500; i++) {
            this.randomPoints.push({
                lat: getRandomInRange(latMin, latMax),
                lng: getRandomInRange(lngMin, lngMax),
                name: `Point ${i}`,
                c: "R",
            });
        }

        // Initialize the map with canvas rendering
        this.map = L.map(containerId, { preferCanvas: true })
            // .setView([39.8283, -98.5795], 4)
            .setView([41.6488, -0.8891], 8);

        // Add OpenStreetMap tile layer
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: '© OpenStreetMap contributors'
        // }).addTo(this.map);

        this.araLayer = aragonLayersToCreate[9];


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


        // TODO - falta ajustar el nivel de detalle del zoom
        // https://sigpac.mapa.gob.es/sdg/wmts?layer=ortofotos&style=default&tilematrixset=EPSG3857&time=&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=16&TileCol=32617&TileRow=24403
        // L.tileLayer(
        //     'https://sigpac.mapa.gob.es/sdg/wmts?layer=ortofotos&style=default&tilematrixset=EPSG3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}',
        //     {
        //         attribution: 'SIGPAC Ortofoto © Ministerio de Agricultura, Pesca y Alimentación de España',
        //         // maxZoom: 20, // Adjust as per the service capabilities
        //         // minZoom: 0, // Adjust as per your application
        //         tileSize: 256,
        //     }
        // ).addTo(this.map);



        // Funciona para tipos de cultivo
        // const wmsLayer = L.tileLayer.wms('https://wms.mapama.gob.es/sig/Agricultura/MapaCultivos2000-2010/wms.aspx', {
        //     layers: 'LC.LandCoverSurfaces',
        //     format: 'image/png',
        //     transparent: true,
        //     version: '1.3.0',
        //     attribution: 'Ministerio de Agricultura, Pesca y Alimentación (MAPA)',
        //     maxZoom: 19,
        //     minZoom: 3
        // }).addTo(this.map);


        const vectorTileOptions: VectorTileOptions = {
            vectorTileLayerStyles: {
                // Style for all features in the 'recinto' layer
                recinto: {
                    weight: 1,
                    color: '#000000',
                    opacity: 0.8,
                    fillColor: '#7cbe7c',
                    fillOpacity: 0.4,
                },
            },
            subdomains: '',
            maxNativeZoom: 18,
            minZoom: 15,
            maxZoom: 15,
            // minNativeZoom: 15,
            // maxNativeZoom: 15,
        };

        var pbfLayerUrl = "https://sigpac-hubcloud.es/mvt/recinto@3857@pbf/{z}/{x}/{y}.pbf";
        var opciones = {
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                // A plain set of L.Path options.
                default: {
                    fill: true,
                    stroke: false,
                    fillColor: '#bd2660',
                    fillOpacity: 1,
                    color: '#bd2660',
                    weight: 5,
                    opacity: 5,
                },
            },
            interactive: true,
            // getFeatureId: (x: Feature) => x.type,
            minNativeZoom: 12,
            maxNativeZoom: 15,
            minZoom: 14,           // Layer will only appear at zoom level 12 or higher
            maxZoom: 17,
            attribution: "<a href='https://www.scne.es/'>CC BY 4.0 scne.es</a>",
            opacity: 2,
            updateWhenIdle: false,
            updateWhenZooming: true,
            zIndex: 1000,
        };

        const pbfLayer = L.vectorGrid
            .protobuf(pbfLayerUrl, opciones)
            .addTo(this.map);

        pbfLayer.on('mouseover', function (e) { console.log('->', e.layer.properties); });
        pbfLayer.on('layeradd', function (e) { console.log('Layer added:', e.layer); });

        // var geoJsonLayerUrl = "https://sigpac-hubcloud.es/mvt/recinto@3857@geojson/{z}/{x}/{y}.geojson";
        // var op = {
        //     minNativeZoom: 15,
        //     maxNativeZoom: 15,
        //     minZoom: 12,           // Layer will only appear at zoom level 12 or higher
        //     // fetchOptions: {
        //     //     credentials: 'same-origin', // Send cookies for the current domain
        //     //     headers: {
        //     //         'Accept-Encoding': 'identity' // Inform the server not to use gzip
        //     //     }
        //     // },
        // };
        // L.vectorGrid.protobuf(geoJsonLayerUrl, op).addTo(this.map);



        // https://gis.cayc.es/wms/cayc_general?service=WMS&request=GetMap&layers=parcel_public&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox=0,41.50857729743935,0.3515625,41.77131167976407

        // https://gis.cayc.es/wms/cayc_general?service=WMS&request=GetMap&layers=parcel_public_perimeter&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox=0.3515625,41.50857729743935,0.703125,41.77131167976407

        // https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=irrigationnetwork%2Cirrigationshed&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=false&WIDTH=208&HEIGHT=983&CRS=EPSG%3A4326&BBOX=41.50497780464059%2C0.22659301757812503%2C42.00848901572399%2C0.36941528320312506

        // L.tileLayer.wms(
        //     'https://servicios.idee.es/wms-inspire/mdt',
        //     {
        //         crs: window.L.CRS.EPSG4326,
        //         transparent: true,
        //         format: 'image/png',
        //         maxZoom: 23,
        //         uppercase: true,
        //         version: '1.3.0',
        //         layers: 'EL.ElevationGridCoverage',
        //         zIndex: 2,
        //         opacity: 0.5,
        //     },
        // ).addTo(this.map);

        // L.tileLayer.wms(
        //     'https://mapas.igme.es/gis/services/Cartografia_Tematica/IGME_Hidrogeologico_200/MapServer/WMSServer',
        //     {
        //         layers: '0',
        //         format: 'image/png',
        //         transparent: true,
        //         crs: window.L.CRS.EPSG4326,
        //         maxZoom: 23,
        //         zIndex: 1,
        //     },
        // ).addTo(this.map);


        // L.Layer()
        // super(options.name, options.active, options.map, options.leafletLayer, options.varName);


        // new CustomGridLayer().addTo(this.map);

        // Initialize info panel
        // this.infoPanel = this.createInfoPanel();
        // this.infoPanel.addTo(this.map);
    }

    public addPoints(points: Point[]): void {
        this.points = points;
        this.renderPoints();
    }

    public getViewPortData(): void {
        const size = this.map.getSize();
        console.log("Size", size);

        const centerCoords = this.map.getCenter();
        console.log("CenterCoord", centerCoords);

        const bounds = this.map.getBounds();
        console.log("Bounds", bounds);

        const boundsEast = bounds.getEast();
        const boundsWest = bounds.getWest();

        const zoomLevel = this.map.getZoom();
        console.log("zoomLevel", zoomLevel);
    }

    public startReadingGrains(): void {
        this.interid = setInterval(() => {
            fetch("http://localhost:5118/getAllPoints")
                .then(x => x.json())
                .then(x => {
                    // console.log(x);
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

            // Function to generate a random number between min and max
            const getRandomInRange = (min: number, max: number) => min + Math.random() * (max - min);

            // const randomPoints: Point[] = [];

            // for (let i = 0; i < 1000; i++) {
            //     randomPoints.push({
            //         lat: getRandomInRange(latMin, latMax),
            //         lng: getRandomInRange(lngMin, lngMax),
            //         name: `Point ${i}`,
            //         c: "R",
            //     });
            // }

            this.clearPoints();

            this.points = this.randomPoints.map(x => x = {
                lat: x.lat,
                lng: x.lng,
                name: x.name,
                c: getRandomInRange(1, 100) > 50 ? "R" : "G",
            });

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

            const circle = L.circleMarker([point.lat, point.lng], {
                radius: 4,
                fillColor: point.c === "R" ? '#ff4444' : '#44ff44',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(point.name);

            // Bind a permanent tooltip to the marker
            // circle.bindTooltip(`${point.c === "R" ? "<50%" : ""}`, {
            //     permanent: true,
            //     direction: 'top', // Adjust tooltip position (e.g., 'top', 'bottom', 'left', 'right', 'center')
            //     className: 'custom-tooltip', // Optional: Custom CSS class for styling
            //     offset: [0, -10], // Optional: Adjust tooltip offset
            // });

            circle.addTo(this.map);
        });

        this.updateInfoPanel();

        this.getViewPortData();
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

// function getScaleOfMap(mapToGetScale: Map) {
//     const centerScaleMap = mapToGetScale.getSize().y / 2;
//     const realWorlMetersPer100Pixels = mapToGetScale.distance(
//         mapToGetScale.containerPointToLatLng([0, centerScaleMap]),
//         mapToGetScale.containerPointToLatLng([100, centerScaleMap]),
//     );

//     let heightRef = document.createElement('div');
//     heightRef.style = 'height:1mm;display:none';
//     heightRef.id = 'heightRef';
//     document.body.appendChild(heightRef);

//     heightRef = document.getElementById('heightRef');
//     const pxPermm = $('#heightRef').height();
//     heightRef.parentNode.removeChild(heightRef);

//     const mmOf100Px = 100 / pxPermm;
//     const screenMetersPer100Pixels = mmOf100Px / 1000;
//     return realWorlMetersPer100Pixels / screenMetersPer100Pixels;
// }


// const defaultLayer = '../../movallibs/js/moval_gis_viewer_layer_control/imgs/default.svg';
// https://gis.cayc.es/movallibs/js/moval_gis_viewer_layer_infotable/moval_gis_viewer_layer_infotable.js
// https://gis.cayc.es/movallibs/js/moval_gis_viewer_layer_infotable/locales/{{lng}}.json
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













// Antes estaban en el constructor

// L.tileLayer.wms('https://icearagon.aragon.es/AragonFotos',
//     {
//         layers: this.araLayer.leafletName,
//         format: 'image/png',
//         transparent: true,
//         crs: window.L.CRS.EPSG4326,
//         maxZoom: 23,
//     },
// ).addTo(this.map);

// NO VA
// this.catLayer = catLayers[0];
// L.tileLayer.wms(
//     'https://geoserveis.icgc.cat/servei/catalunya/orto-territorial/wms',
//     {
//         layers: this.araLayer.leafletName,
//         format: 'image/png',
//         transparent: true,
//         crs: window.L.CRS.EPSG4326,
//         maxZoom: 23,
//     },
// ).addTo(this.map);

// RISK AREA (it works)
// L.tileLayer.wms(
//     'https://wms.mapama.gob.es/sig/Agua/ZI_LaminasQ10/wms.aspx?',
//     {
//         layers: 'NZ.RiskZone',
//         crs: window.L.CRS.EPSG4326,
//         format: 'image/png',
//         maxZoom: 23,
//         transparent: true,
//     },
// ).addTo(this.map);


// L.tileLayer(
//     'https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.3.0&Format=image/png&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
//     {
//         attribution: 'PNOA WMTS. Cedido por © Instituto Geográfico Nacional de España',
//         minZoom: 4,
//         maxNativeZoom: 20,
//         maxZoom: 23,
//         bounds: [
//             [22.173559281306314, -47.0716243806546],
//             [66.88067635831743,
//                 40.8749629405498,
//             ],
//         ],
//     },
// ).addTo(this.map);


// L.tileLayer.wms(
//     'https://www.ign.es/wms/pnoa-historico',
//     {
//         layers: 'SIGPAC',
//         crs: window.L.CRS.EPSG4326,
//         format: 'image/png',
//         maxZoom: 23,
//         transparent: true,
//     },
// ).addTo(this.map);

// L.tileLayer.wms(
//     'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
//     {
//         layers: 'SIGPAC',
//         crs: window.L.CRS.EPSG4326,
//         format: 'image/png',
//         maxZoom: 23,
//         transparent: true,
//     },
// ).addTo(this.map);

// L.tileLayer.wms(
//     'https://mapas.igme.es/gis/services/Cartografia_Tematica/IGME_Hidrogeologico_200/MapServer/WMSServer',
//     {
//         layers: '0',
//         format: 'image/png',
//         transparent: true,
//         crs: window.L.CRS.EPSG4326,
//         maxZoom: 23,
//         zIndex: 1,
//     },
// ).addTo(this.map);


// L.tileLayer.wms(
//     'https://servicios.idee.es/wms-inspire/mdt',
//     {
//         crs: window.L.CRS.EPSG4326,
//         transparent: true,
//         format: 'image/png',
//         maxZoom: 23,
//         uppercase: true,
//         version: '1.3.0',
//         layers: 'EL.ContourLine',
//         zIndex: 2,
//         // maxZoomLayer: 3000,
//     },
// ).addTo(this.map);

// L.tileLayer.wms(
//     'https://wms.mapa.gob.es/sigpac/ows',
//     {
//         crs: window.L.CRS.EPSG4326,
//         transparent: true,
//         format: 'image/png',
//         maxZoom: 23,
//         uppercase: true,
//         version: '1.3.0',
//         layers: 'EL.ContourLine',
//         zIndex: 2,
//         // maxZoomLayer: 3000,
//         // identify: false,
//         // maxZoomLayer: 23,
//     },
// ).addTo(this.map);


const catLayers: MapLayer[] = [
    { name: 'Ortofoto - 1945', leafletName: 'ortofoto_blanc_i_negre_1945', varName: 'catalunyaBase1945', year: 1945 },
    { name: 'Ortofoto - 1956', leafletName: 'ortofoto_blanc_i_negre_1956', varName: 'catalunyaBase1956', year: 1956 },
    { name: 'Ortofoto - 1970-1977', leafletName: 'ortofoto_blanc_i_negre_1970-1977', varName: 'catalunyaBase1970_77', year: 1970 },
    { name: 'Ortofoto - 1983-1992', leafletName: 'ortofoto_blanc_i_negre_1983-1992', varName: 'catalunyaBase1983_92', year: 1983 },
    { name: 'Ortofoto - 1993', leafletName: 'ortofoto_color_1993', varName: 'catalunyaBase1993', year: 1993 },
    { name: 'Ortofoto - 1994-1997', leafletName: 'ortofoto_blanc_i_negre_1994-1997', varName: 'catalunyaBase1994_97', year: 1994 },
    { name: 'Ortofoto - 1998', leafletName: 'ortofoto_blanc_i_negre_1998', varName: 'catalunyaBase1998', year: 1998 },
    { name: 'Ortofoto - 2000-2003', leafletName: 'ortofoto_color_2000-2003', varName: 'catalunyaBase2000_03', year: 2000 },
    { name: 'Ortofoto - 2004-2005', leafletName: 'ortofoto_color_2004-2005', varName: 'catalunyaBase2004_05', year: 2004 },
    { name: 'Ortofoto - 2006-2007', leafletName: 'ortofoto_color_2006-2007', varName: 'catalunyaBase2006_07', year: 2006 },
    { name: 'Ortofoto - 2008', leafletName: 'ortofoto_color_2008', varName: 'catalunyaBase2008', year: 2008 },
    { name: 'Ortofoto - 2009', leafletName: 'ortofoto_color_2009', varName: 'catalunyaBase2009', year: 2009 },
    { name: 'Ortofoto - 2010', leafletName: 'ortofoto_color_2010', varName: 'catalunyaBase2010', year: 2010 },
    { name: 'Ortofoto - 2011', leafletName: 'ortofoto_color_2011', varName: 'catalunyaBase2011', year: 2011 },
    { name: 'Ortofoto - 2012', leafletName: 'ortofoto_color_2012', varName: 'catalunyaBase2012', year: 2012 },
    { name: 'Ortofoto - 2013', leafletName: 'ortofoto_color_2013', varName: 'catalunyaBase2013', year: 2013 },
    { name: 'Ortofoto - 2014', leafletName: 'ortofoto_color_2014', varName: 'catalunyaBase2014', year: 2014 },
    { name: 'Ortofoto - 2015', leafletName: 'ortofoto_color_2015', varName: 'catalunyaBase2015', year: 2015 },
    { name: 'Ortofoto - 2016', leafletName: 'ortofoto_color_2016', varName: 'catalunyaBase2016', year: 2016 },
    { name: 'Ortofoto - 2017', leafletName: 'ortofoto_color_2017', varName: 'catalunyaBase2017', year: 2017 },
    { name: 'Ortofoto - 2018', leafletName: 'ortofoto_color_2018', varName: 'catalunyaBase2018', year: 2018 },
    { name: 'Ortofoto - 2019', leafletName: 'ortofoto_color_2019', varName: 'catalunyaBase2019', year: 2019 },
    { name: 'Ortofoto - 2020', leafletName: 'ortofoto_color_2020', varName: 'catalunyaBase2020', year: 2020 },
    { name: 'Ortofoto - 2021', leafletName: 'ortofoto_color_2021', varName: 'catalunyaBase2021', year: 2021 },
    { name: 'Ortofoto - 2022', leafletName: 'ortofoto_color_2022', varName: 'catalunyaBase2022', year: 2022 },
    { name: 'Ortofoto (MA)', leafletName: 'ortofoto_color_provisional', varName: 'catalunyaBaseProvisional', year: 2100 }
];

const aragonLayersToCreate: MapLayer[] = [
    { name: 'Ortofoto - 1956', leafletName: '1956_cecaf', varName: 'aragonBase1956', year: 1956 },
    { name: 'Ortofoto - 1997', leafletName: '1997_oleicola', varName: 'aragonBase1997', year: 1997 },
    { name: 'Ortofoto - 1999', leafletName: '1999_DGA', varName: 'aragonBase1999', year: 1999 },
    { name: 'Ortofoto - 2003', leafletName: '2003_fega', varName: 'aragonBase2003', year: 2003 },
    { name: 'Ortofoto - 2006', leafletName: '2006_pnoa', varName: 'aragonBase2006', year: 2006 },
    { name: 'Ortofoto - 2009', leafletName: '2009_pnoa', varName: 'aragonBase2009', year: 2009 },
    { name: 'Ortofoto - 2012', leafletName: '2012_pnoa', varName: 'aragonBase2012', year: 2012 },
    { name: 'Ortofoto - 2015', leafletName: '2015_pnoa', varName: 'aragonBase2015', year: 2015 },
    { name: 'Ortofoto - 2018', leafletName: '2018_pnoa', varName: 'aragonBase2018', year: 2018 },
    { name: 'Ortofoto - 2021', leafletName: '2021_pnoa', varName: 'aragonBase2021', year: 2021 },
];