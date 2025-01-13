import './style.css';
import 'leaflet/dist/leaflet.css';
import { setupCounter } from './counter.ts';

import { CanvasMap } from './CanvasMap';
// import { RandomCanvasMap } from './RandomCanvasMap.ts';

const map = new CanvasMap('map');
// map.addRandomPoints(10000);
// map.startInterval();
map.startReadingGrains();


// document.addEventListener('DOMContentLoaded', () => {
// const map = new CanvasMap('map');
// map.addRandomPoints(10000);
// map.startInterval();

// const map = new RandomCanvasMap('map');
// map.startRandomUpdates(1000);
// });


// Add all points as circle markers
// points.forEach(point => {
//   L.circleMarker([point.lat, point.lng], {
//     radius: 4,
//     fillColor: '#ff4444',
//     color: '#000',
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
//   })
// .bindPopup(point.name)
// .addTo(map);
// });


// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>

//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>

//     <h1>Vite + TypeScript</h1>

//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>

//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });





// aqui se llama
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);