import {useContext, useEffect, useRef, useState} from "react";
import MapContext from "../map/MapContext";
import {view, wfsLayers, wmsSource} from "../map/openlayers_map";
import {GeoJSON} from "ol/format";
import VectorSource from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";
import styled from "styled-components";
import LayerSelect from "./LayerSelect";
import {bbox as bboxStrategy} from "ol/loadingstrategy";

const selectStyle = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
    }),
});

function MapInfoBox() {
    const {instance: map, isLoading} = useContext(MapContext);
    const [bbox, setBbox] = useState([] as number[]);
    const [currentPoint, setCurrentPoint] = useState([] as number[])
    const [epsg, setEpsg] = useState("")
    const [infoString, setInfoString] = useState("")
    const select = useRef<any>(null);

    useEffect(() => {
        const epsg = map.getView().getProjection().getCode();
        // const zoom = map.getView().getZoom(); // zoom 크기 사용 방법
        setEpsg(epsg);

        map.on('moveend', e => {
            const extend: number[] = map.getView().calculateExtent();
            setBbox(extend);
        })

        map.once('singleclick', e => {

            if (infoString) setInfoString("");
            const viewResolution = /** @type {number} */ (view.getResolution());
            if (typeof viewResolution === "number") {
                const url = wmsSource.getFeatureInfoUrl(
                    e.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    {'INFO_FORMAT': 'text/html'}
                );
                if (url) {
                    fetch(url)
                        .then((response) => response.text())
                        .then((html) => {
                            // document.getElementById('info').innerHTML = html;
                            setInfoString(html);
                        });
                }
            }

        })

    }, [bbox]);
    const handleOnClickResearchButton = () => {
        const wfsSource = new VectorSource({
            format: new GeoJSON(),
            url: function (extent) {
                return ('http://localhost:80/geoserver/wfs?service=WFS&version=1.1.0' +
                    '&request=GetFeature&typename=ne:countries&outputFormat=application/json' +
                    `&srsName=EPSG:3857&bbox=${bbox.join(',')},EPSG:3857`);
            },
            strategy: bboxStrategy
        });
        wfsLayers.setSource(null);
        wfsLayers.setSource(wfsSource);
        map.removeLayer(wfsLayers);
        map.addLayer(wfsLayers);
    }


    return <MapInfoBoxTemplate>
        <LayerSelect></LayerSelect>
        <div className={''}>
            {epsg}
        </div>
        <div dangerouslySetInnerHTML={{__html: infoString}}></div>
        <div>
            현재 BBOX:
            <input type={'text'} value={bbox.map(e => e + ":")} readOnly/>
            <input type={'text'} value={bbox.map(e => e + ":")} readOnly/>
        </div>
        <div>
            마우스 위치 :
            <input type={'text'} value={currentPoint.map(e => e.toString())} readOnly/>
        </div>
        <button onClick={handleOnClickResearchButton}>검색</button>
    </MapInfoBoxTemplate>;
}

export default MapInfoBox;

const MapInfoBoxTemplate = styled.div`
  position: absolute;
  width: 400px;
  bottom: 20px;
  right: 0;
  padding: 20px;
  border-radius: 20px;
  background-color: white;
  z-index: 100;
  overflow-wrap: break-word;
`