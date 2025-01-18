import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, transformExtent } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { Circle, MultiPoint, Point as OLPoint, Point } from 'ol/geom';
import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { get as getProjection } from 'ol/proj';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import { createXYZ } from 'ol/tilegrid';
import Icon from 'ol/style/Icon';
// import Layer from 'ol/renderer/webgl/Layer';
import { ZoomSlider } from 'ol/control';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';



interface IPoint {
    lat: number;
    lng: number;
    name: string;
    c: string;
}

export class OpenLayersMap {
    private map: Map;
    private randomPoints: IPoint[] = [];

    constructor(containerId: string) {
        // Generate random points (same as original)
        const latMin = 41.7;
        const latMax = 41.89;
        const lngMin = 0.2715;
        const lngMax = 0.39;

        const getRandomInRange = (min: number, max: number) => min + Math.random() * (max - min);

        for (let i = 0; i < 500; i++) {
            this.randomPoints.push({
                lat: getRandomInRange(latMin, latMax),
                lng: getRandomInRange(lngMin, lngMax),
                name: `Point ${i}`,
                c: "R",
            });
        }

        const atlas = new Feature({
            geometry: new Point(fromLonLat([-0.87734, 41.65606])),
        });

        atlas.setStyle(
            new Style({
                image: new Icon({
                    color: '#BADA55',
                    crossOrigin: 'anonymous',
                    src: 'data/square.svg',
                }),
            }),
        );

        const atlasVectorSource = new VectorSource({
            features: [atlas],
        });

        const atlasVectorLayer = new VectorLayer({
            source: atlasVectorSource,
            style: {
                'circle-radius': 9,
                'circle-fill-color': 'red',
            },
        });


        const atlasLowBatteryStyle = new Style({
            image: new CircleStyle({
                radius: 4,
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.6)', // Red with 80% opacity
                }),
                // stroke: new Stroke({ color: 'red', width: 0 }),
            }),
        });

        const atlasGoodBatteryStyle = new Style({
            image: new CircleStyle({
                radius: 4,
                fill: new Fill({
                    color: 'rgba(0, 255, 0, 0.6)', // Red with 80% opacity
                }),
                // stroke: new Stroke({ color: 'red', width: 0 }),
            }),
        });


        // Create vector source and features for random points
        const vectorSource = new VectorSource({
            features: this.randomPoints.map(point => {
                return new Feature({
                    geometry: new Point(fromLonLat([point.lng, point.lat])),
                    name: point.name,
                    style: atlasLowBatteryStyle,
                    category: point.c,
                });
            })
        });

        const vectorSource2 = new VectorSource({
            features: this.randomPoints.map(point => {
                return new Feature({
                    geometry: new Point(fromLonLat([point.lng, point.lat])),
                    name: point.name,
                    style: atlasGoodBatteryStyle,
                    category: point.c,
                });
            })
        });

        // Create vector layer for points
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: atlasLowBatteryStyle // Apply the style at the layer level
        });

        // Create CAYC WMS layers
        const parcelPerimeterLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://gis.cayc.es/wms/cayc_general',
                params: {
                    'LAYERS': 'parcel_public_perimeter,parcel_public',
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true,
                    'VERSION': '1.1.1'
                },
                projection: 'EPSG:4326'
            }),
            minZoom: 12,  // Set minimum zoom for source
            // extent: [0.122788, 41.4216, 0.619919, 42.087], // Include the bounding box
        });

        // const parcelPublicLayer = new TileLayer({
        //     source: new TileWMS({
        //         url: 'https://gis.cayc.es/wms/cayc_general',
        //         params: {
        //             'LAYERS': 'parcel_public',
        //             'FORMAT': 'image/png',
        //             'TRANSPARENT': true,
        //             'VERSION': '1.1.1'
        //         },
        //         projection: 'EPSG:4326'
        //     }),
        //     minZoom: 12,
        // });

        const irrigationLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://gis.cayc.es/wms/cayc_general',
                params: {
                    'LAYERS': 'irrigationnetwork,irrigationshed',
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true,
                    'VERSION': '1.3.0'
                },
                projection: 'EPSG:4326',
                // tileGrid: createXYZ({
                //     maxZoom: 15,
                //     minZoom: 15,  // Set minimum zoom
                // }),
            }),
            minZoom: 12,  // Set minimum zoom for source
        });





        const necesidadesDeRiegoLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://wmts.mapama.gob.es/sig/desarrollorural/necesidades_riego/ows?',
                params: {
                    'SERVICE': 'WMS',
                    'VERSION': '1.3.0',
                    'REQUEST': 'GetMap',
                    'LAYERS': 'necesidades_riego',
                    'STYLES': 'DesarrolloRural_re_riego',
                    'FORMAT': 'image/png',
                    'CRS': 'EPSG:4326',
                },
                serverType: 'geoserver',
                crossOrigin: 'anonymous',
            }),
        });

        // Example: Add a vector layer to load GeoJSON
        // Initialize Vector Layer for GeoJSON Results
        const necesicadesDeRiegoGeojsonVectorLayer = new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
            }),
        });

        // Add to the map
        // map.addLayer(vectorLayer);


        // Create vector tile layer for SIGPAC parcels
        const vectorTileLayer = new VectorTileLayer({
            source: new VectorTileSource({
                format: new GeoJSON({
                    // Assuming the features are in EPSG:3857
                    dataProjection: 'EPSG:3857',
                    featureProjection: 'EPSG:3857'
                }),
                url: 'https://sigpac-hubcloud.es/mvt/recinto@3857@geojson/{z}/{x}/{y}.geojson',
                tileGrid: createXYZ({
                    maxZoom: 15,
                    minZoom: 15,  // Set minimum zoom
                })
            }),
            minZoom: 15,  // Set minimum zoom for source
            // Style can be added here if needed
            style: new Style({
                stroke: new Stroke({
                    color: '#0000ff',
                    width: 0.6,
                    lineDash: [4],
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.05)',
                })
            }),
            visible: true,
            // opacity: 10,
            // The layer will only be visible at zoom level 15 or higher
            // You can use this function to control visibility based on zoom
            // prerender: function (evt) {
            //     const map = evt.target.getMap();
            //         this.setVisible(zoom >= 15);
            //     }
            // }
        });

        // Base CartoDB layer
        const baseLayer = new TileLayer({
            source: new XYZ({
                url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            })
        });

        // Initialize the map
        this.map = new Map({
            controls: defaultControls().extend([new ScaleLine()]),
            target: containerId,
            maxTilesLoading: 20,
            layers: [
                baseLayer,
                // Add CAYC layers
                parcelPerimeterLayer,
                // parcelPublicLayer,
                // irrigationLayer,

                // necesidadesDeRiegoLayer,
                // necesicadesDeRiegoGeojsonVectorLayer,

                vectorLayer,

                vectorTileLayer,
                atlasVectorLayer
            ],
            view: new View({
                center: fromLonLat([-0.8891, 41.6488]), // Note: OpenLayers uses [lon, lat] order
                zoom: 10
            })
        });

        const zoomslider = new ZoomSlider();
        this.map.addControl(zoomslider);





        // ADD EVENTS
        // Handle Click Event to Request GetFeatureInfo
        this.map.on('singleclick', async (event) => {
            const viewResolution = this.map.getView().getResolution() ?? 1;
            const wmsSource = necesidadesDeRiegoLayer.getSource();

            const url = wmsSource?.getFeatureInfoUrl(
                event.coordinate, // Coordinate of the click
                viewResolution,
                'EPSG:4326', // Projection
                {
                    'INFO_FORMAT': 'application/json', // Request GeoJSON
                    // 'INFO_FORMAT': 'application/json;type=geojson', // Request GeoJSON
                }
            );

            // https://wmts.mapama.gob.es/sig/desarrollorural/necesidades_riego/ows?REQUEST=GetFeatureInfo&QUERY_LAYERS=necesidades_riego&SERVICE=WMS&VERSION=1.3.0&STYLES=DesarrolloRural_re_riego&TRANSPARENT=true&LAYERS=necesidades_riego&CRS=EPSG%3A4326&INFO_FORMAT=application%2Fjson&I=100&J=244&WIDTH=256&HEIGHT=256&BBOX=5099490%2C-84060%2C5099850%2C-83700

            if (url) {
                try {
                    const response = await fetch(url);
                    const geojson = await response.json();
                    console.log(geojson);
                    // Update the vector source with the new data
                    necesicadesDeRiegoGeojsonVectorLayer.getSource()?.clear();
                    necesicadesDeRiegoGeojsonVectorLayer.getSource()?.addFeatures(new GeoJSON().readFeatures(geojson));
                } catch (error) {
                    console.error('Error fetching GeoJSON:', error);
                }
            }
        });



        // Add hover interaction (optional)
        // this.map.on('pointermove', (e) => {
        //     const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
        //     if (feature) {
        //         const element = this.map.getTargetElement();
        //         element.style.cursor = 'pointer';
        //     } else {
        //         const element = this.map.getTargetElement();
        //         element.style.cursor = '';
        //     }
        // });

        // this.map.on('pointermove', (evt) => {
        //     const info: HTMLElement | null = document.getElementById('info');
        //     let currentFeature: any;

        //     if (!info) return;

        //     if (evt.dragging) {
        //         info.style.visibility = 'hidden';
        //         currentFeature = undefined;
        //         return;
        //     }

        //     const pixel = this.map.getEventPixel(evt.originalEvent);
        //     this.displayFeatureInfo(pixel, evt.originalEvent.target);
        // });

    }


    public displayFeatureInfo(pixel: [number, number], target: EventTarget | null): void {
        const info: HTMLElement | null = document.getElementById('info');
        let currentFeature: any;

        if (!info) return;

        const feature = (target instanceof HTMLElement && target.closest('.ol-control'))
            ? undefined
            : this.map.forEachFeatureAtPixel(pixel, (feature) => feature);

        if (feature) {
            info.style.left = `${pixel[0]}px`;
            info.style.top = `${pixel[1]}px`;

            if (feature !== currentFeature) {
                info.style.visibility = 'visible';
                info.innerText = `provincia: ${feature.get('provincia') || ''}\n` +
                    `municipio: ${feature.get('municipio') || ''}\n` +
                    `agregado: ${feature.get('agregado') || ''}\n` +
                    `zona: ${feature.get('zona') || ''}\n` +
                    `poligono: ${feature.get('poligono') || ''}\n` +
                    `parcela: ${feature.get('parcela') || ''}\n` +
                    `recinto: ${feature.get('recinto') || ''}\n` +
                    `superficie: ${feature.get('superficie') || ''}\n` +
                    `pendiente_media: ${feature.get('pendiente_media') || ''}\n` +
                    `altitud: ${feature.get('altitud') || ''}\n` +
                    `uso_sigpac: ${feature.get('uso_sigpac') || ''}\n` +
                    `subvencionabilidad: ${feature.get('subvencionabilidad') || ''}\n` +
                    `coef_regadio: ${feature.get('coef_regadio') || ''}\n` +
                    `incidencias: ${feature.get('incidencias') || ''}\n` +
                    `region: ${feature.get('region') || ''}`;
            }
        } else {
            info.style.visibility = 'hidden';
        }
        currentFeature = feature;
    };

    public generateRandomPoints(latMin: number, latMax: number, lngMin: number, lngMax: number) {
        const getRandomInRange = (min: number, max: number) => min + Math.random() * (max - min);
        for (let i = 0; i < 200; i++) {
            this.randomPoints.push({
                lat: getRandomInRange(latMin, latMax),
                lng: getRandomInRange(lngMin, lngMax),
                name: `Point ${i}`,
                c: "R",
            });
        }
    }

    // Method to add additional WMS layers
    public addWMSLayer(url: string, layers: string, options: any = {}) {
        const wmsLayer = new TileLayer({
            source: new TileWMS({
                url: url,
                params: {
                    'LAYERS': layers,
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true,
                    ...options
                }
            })
        });
        this.map.addLayer(wmsLayer);
    }

    // Method to update view
    public setView(lon: number, lat: number, zoom: number) {
        this.map.getView().setCenter(fromLonLat([lon, lat]));
        this.map.getView().setZoom(zoom);
    }
}