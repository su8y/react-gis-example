import {Modify, Select} from "ol/interaction";
import {wfsLayers} from "../map/openlayers_map";
import {click, pointerMove} from "ol/events/condition";

export const selectMode = new Select({
    condition:pointerMove,
    layers: [wfsLayers],
})
export const modifyMode = new Modify({
    features: selectMode.getFeatures(),
});
export const clickMode = new Select({
    condition: click,
})
