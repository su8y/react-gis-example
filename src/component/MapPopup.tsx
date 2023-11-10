import {useContext, useEffect} from "react";
import {Overlay} from "ol";
import MapContext from "../map/MapContext";
import styled from "styled-components";

const MapPopup = () => {
    const {instance: map, isLoading} = useContext(MapContext)
    useEffect(() => {
        if (isLoading) return () => {};
        let popup: HTMLElement | null = document.querySelector("#map-popup");
        if (popup === null) {
            popup = document.createElement("div");
            popup.setAttribute("id", "popup");
        }

        const overlay = new Overlay({
            element: popup,
            positioning: "center-center",
            autoPan: {
                animation: {
                    duration: 250
                }
            }
        })
        map.addOverlay(overlay);
    }, []);
    return <>
        <MapPopUpTemplate id="map-popup"></MapPopUpTemplate>
    </>
}
const MapPopUpTemplate = styled.div`
`
export default MapPopup;