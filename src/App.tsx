import React, {useContext, useEffect} from 'react';
import MapContext from "./map/MapContext";
import MapInfoBox from "./component/MapInfoBox";
import styled from "styled-components";
import MapPopup from "./component/MapPopup";
import MyMap from "./map";


function App() {
    const {instance: map, isLoading} = useContext(MapContext)

    useEffect(() => {
        if (isLoading) return;
        map.on('pointermove', e => {
            map.getViewport().style.cursor = map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '';
        })
    }, [isLoading]);


    return (<>
        <MapInfoBox></MapInfoBox>
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
