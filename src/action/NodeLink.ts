import {pointSource, pointVectorLayers} from "../map/openlayers_map";
import {Feature, Map as OlMap} from "ol";
import {MultiPoint, Point} from "ol/geom";
import {Layer} from "ol/layer";


export function createNodeLink(e: any, map: OlMap) {
    pointSource.clear();
    pointSource.addFeature(new Feature({geometry: new MultiPoint([1, 1])}));
    let allLayers: Layer[] = map.getAllLayers();

    let filter = allLayers.filter(e => e.getProperties().name === "draw").length >= 1;
    if (filter) return;

    const feature = map.forEachFeatureAtPixel(e.pixel, function (f): any {
        if (f.getGeometry() instanceof Point) return null;
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