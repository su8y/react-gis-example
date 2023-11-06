import React, {useContext, useEffect, useState} from 'react';
import MapContext from "./map/MapContext";
import {OSMlayers, WMSImageLayer} from "./map/openlayers_map";
import LayerSelect from "./component/LayerSelect";
import MapInfoBox from "./component/MapInfoBox";
import styled from "styled-components";
import {Fill, Stroke, Style} from "ol/style";

const selectStyle = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
    }),
});


function App() {

    const {instance: map, isLoading} = useContext(MapContext)



    return (<>
        {
            isLoading ? <div>none</div> : <>
                <MapInfoBox></MapInfoBox></>
        }
        <MapTemplate id={'map'}></MapTemplate>
    </>);
}

const MapTemplate = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
`


export default App;
