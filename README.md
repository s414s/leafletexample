# leafletexample
sentinel-hub
https://openlayers.org/en/latest/examples/getfeatureinfo-tile.html



https://www.idee.es/segun-tipo-de-servicio


NECESIDADES DE RIEGO LEGEND
https://wmts.mapama.gob.es/sig/desarrollorural/necesidades_riego/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&width=147&height=279&layer=necesidades_riego

IMPLEMENTAR
https://www.mapa.gob.es/es/cartografia-y-sig/ide/directorio_datos_servicios/agricultura/wms-inspire-agricultura.aspx


https://www.mapama.gob.es/ide/metadatos/srv/api/records/ef87ca13-e8a4-47e4-bfa0-386c76243e19?language=all

https://knowledge-base.inspire.ec.europa.eu/index_en

For concurrent requests
https://github.com/openlayers/openlayers/issues/7101


https://idemap.es/utilGis/lib/ol-5/v5.3.0/examples/d3.html
check strategies

==== GET CAPABILITIES ====
https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities

=== TODO === integrar catastro
https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?service=WMS&request=GetMap&version=1.1.1&layers=Catastro&styles=&format=image%2Fpng&transparent=true&width=1900&height=983&srs=EPSG%3A4326&bbox=0.34838676452636724%2C41.763892933353915%2C0.36877155303955084%2C41.771759001751064

=== TODO === integrar codigos de parcelas
https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=irrigationnetwork%2Cirrigationshed%2Cparcel_class_name&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=false&WIDTH=1900&HEIGHT=983&CRS=EPSG%3A4326&BBOX=41.763892933353915%2C0.34838676452636724%2C41.771759001751064%2C0.36877155303955084


=== TODO === integrar clases de regacio
https://gis.cayc.es/wms/cayc_general?service=WMS&request=GetMap&layers=parcel_class&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox=0.3680419921875,41.7631174470059,0.37078857421875,41.76516610331408

=== TODO === integrar clases de secano
https://gis.cayc.es/wms/cayc_general?service=WMS&request=GetMap&layers=parcel_class_dry&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox=0.3680419921875,41.7631174470059,0.37078857421875,41.76516610331408

Cabeceras acequias
https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=irrigationnetwork%2Cirrigationshed%2Cflowdivider&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=false&WIDTH=1900&HEIGHT=983&CRS=EPSG%3A4326&BBOX=41.78766500688206%2C0.23017644882202148%2C41.79552816004686%2C0.2505612373352051



SIGPAC version raster
https://wms.mapa.gob.es/sigpac/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=recinto&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&WIDTH=1900&HEIGHT=983&CRS=EPSG%3A4326&BBOX=41.77647254889447%2C0.22474765777587893%2C41.78433707478865%2C0.24513244628906253


==== TESTING GETTING METADA ====
https://gis.cayc.es/wms/cayc_general?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=irrigationnetwork%2Cirrigationshed&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=41.75079345703125%2C0.262298583984375%2C41.752166748046875%2C0.263671875


-> LEGEND
https://gis.cayc.es/wms/cayc_general?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=irrigationshed&format=image/png&STYLE=default

-> INFO

MapShed
https://gis.cayc.es/wms/cayc_general?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=irrigationnetwork%2Cirrigationshed&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=41.79130554199219%2C0.2547454833984375%2C41.791648864746094%2C0.25508880615234375





https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=irrigationshed&QUERY_LAYERS=irrigationshed&STYLES=&TRANSPARENT=true&FORMAT=image/png&BBOX=41.75079345703125,0.262298583984375,41.752166748046875,0.263671875&CRS=EPSG:4326&WIDTH=256&HEIGHT=256&I=128&J=128&INFO_FORMAT=application/json





https://openlayers.org/en/latest/apidoc/module-ol_loadingstrategy.html
https://openlayers.org/en/latest/examples/filter-points-webgl.html

https://openlayers.org/en/latest/examples/dynamic-data.html

npm install leaflet @types/leaflet leaflet.vectorgrid @types/leaflet.vectorgrid
https://gis.stackexchange.com/questions/256888/styling-geoserver-pbf-vector-tiles-in-leaflet

https://sigpac-hubcloud.es/html/mvt/descServicio.html

https://sigpac.mapa.gob.es/vectorsdg/vector/parcela@3857/15.16308.20566.geojson
https://sigpac.mapa.gob.es/vectorsdg/vector/parcela@3857/15.16308.20566.pbf




https://sigpac-hubcloud.es/mvt/recinto@3857@geojson/{z}/{x}/{y}.geojson
https://sigpac-hubcloud.es/mvt/recinto@3857@pbf/{z}/{x}/{y}.pbf


https://mappinggis.com/2017/12/como-utilizar-vector-tiles-en-leaflet/

Visor
https://sigpac.mapa.gob.es/fega/visor/

https://sigpac-hubcloud.es/html/mvt/descServicio.html

// Parcelas agrarias
https://sigpac.mapa.gob.es/sdg/wmts?layer=ortofotos&style=default&tilematrixset=EPSG3857&time=&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=16&TileCol=32617&TileRow=24403






npm warn deprecated point-geometry@0.0.0: This module has moved: please install @mapbox/point-geometry instead
npm warn deprecated vector-tile@1.3.0: This module has moved: please install @mapbox/vector-tile instead





https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=parcel_public&QUERY_LAYERS=parcel_public&STYLES=&TRANSPARENT=true&FORMAT=image/png&BBOX=0.15380859375,41.7041015625,0.17578125,41.72607421875&SRS=EPSG:4326&WIDTH=256&HEIGHT=256&I=128&J=128&INFO_FORMAT=application/json


To get GeoJson:
https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=parcel_public&QUERY_LAYERS=parcel_public&STYLES=&TRANSPARENT=true&FORMAT=image/png&BBOX=0.15380859375,41.7041015625,0.17578125,41.72607421875&SRS=EPSG:4326&WIDTH=256&HEIGHT=256&I=128&J=128&INFO_FORMAT=application/json

or
https://gis.cayc.es/wms/cayc_general?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=parcel_public&QUERY_LAYERS=parcel_public&STYLES=&TRANSPARENT=true&BBOX=0.15380859375,41.7041015625,0.17578125,41.72607421875&SRS=EPSG:4326&WIDTH=256&HEIGHT=256&I=128&J=128&INFO_FORMAT=application/json



INFO_FORMAT=application/json (or application/geo+json if supported) to get GeoJSON.

Parameters Breakdown:

SERVICE=WMS: Specifies WMS.
VERSION=1.1.1: Version of the WMS service.
REQUEST=GetFeatureInfo: Retrieves vector data for queried features.
LAYERS=parcel_public: Layers displayed in the map.
QUERY_LAYERS=parcel_public: Layers to query for features.
BBOX=...: Geographic extent, same as in your GetMap request.
SRS=EPSG:4326: Coordinate system.
WIDTH=256, HEIGHT=256: Size of the image.
I=128, J=128: Pixel coordinates to query (center of the 256x256 image).
INFO_FORMAT=application/json: Specifies GeoJSON output format.