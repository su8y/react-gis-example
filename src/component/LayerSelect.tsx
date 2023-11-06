import React, {useContext, useEffect, useState} from "react";
import {OSMlayers, WMSImageLayer} from "../map/openlayers_map";
import MapContext from "../map/MapContext";

function LayerSelect() {
    const {instance, isLoading} = useContext(MapContext)
    const [layerState, setLayerState] = useState("");

    useEffect(() => {
        if (isLoading) return;
        instance.getAllLayers().forEach(e => instance.removeLayer(e));
        switch (layerState) {
            case 'base-vworld-base':
                instance.setLayers(OSMlayers);
                instance.addLayer(WMSImageLayer[0]);
                break;

            default:
                instance.setLayers(OSMlayers);
                // setExtState(false);
                break;
        }

    }, [layerState])
    return <>
        <label>
            Layer 선택
        </label>
        <select value={layerState}
                onChange={(e) => setLayerState(e.target.value)}>
            <option value={'base-osm'}>
                OSM
            </option>
            <option value={'base-vworld-base'}>
                VWORLD 기본
            </option>
        </select>
    </>

}

export default LayerSelect;