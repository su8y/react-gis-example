import {View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from "ol/layer/Image.js";
import {ImageWMS} from "ol/source.js";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import {Modify, Select} from "ol/interaction";

export const wmsSource = new ImageWMS({
    url: 'http://localhost/geoserver/wms',
    params: {'LAYERS': 'ne:countries'},
    ratio: 1,
    crossOrigin: 'anonymous',
    serverType: 'geoserver',
});
export const WMSImageLayer = [new ImageLayer({
    source: wmsSource
})]

export const OSMlayers = [
    new TileLayer({
        source: new OSM(),
        properties: {
            name: "base-osm"
        }
    })
];
export const view = new View({
    center: [0, 0],
    zoom: 3,
    projection: 'EPSG:3857'
})


export const wfsLayers = new VectorLayer({
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(0, 0, 255, 1.0)',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(100,100,100,0.25)',
        })
    }),
});
export const selectMode = new Select({
    layers: [wfsLayers],
})
export const modifyMode = new Modify({
    features: selectMode.getFeatures(),
});
