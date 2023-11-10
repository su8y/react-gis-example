import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Draw} from "ol/interaction";
import {Geometry} from "ol/geom";

interface PropsType {
    source: null | VectorSource<Geometry>
    type: string

}

export const drawSource = new VectorSource();
export const drawLayer = new VectorLayer({
    source: drawSource,
    properties: {
        name: "draw",
    }
})
export const drawInteraction = new Draw({
    source: drawLayer.getSource() || drawSource,
    type: "Point",
    geometryName: "test_point"
})