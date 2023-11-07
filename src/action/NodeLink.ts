import {pointSource, pointVectorLayers} from "../map/openlayers_map";
import {Feature, Map as OlMap} from "ol";
import {MultiPoint} from "ol/geom";


export function createNodeLink(e: any, map: OlMap) {

    pointSource.clear();
    const feature = map.forEachFeatureAtPixel(e.pixel, function (f): any {
        return f;
    })
    if (!feature) return;
    const coordinates: number[][][] = feature?.getGeometry().getCoordinates();

    coordinates.forEach(coord => {
        coord.forEach(c => {
            pointSource.addFeature(new Feature({geometry: new MultiPoint(c)}));
        })
    })
    // const madePoint = new Feature({geometry: new Point(e.coordinate)});
    map.removeLayer(pointVectorLayers);
    map.addLayer(pointVectorLayers);

}