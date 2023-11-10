import {useContext, useEffect, useMemo, useState} from "react";
import MapContext from "../map/MapContext";
import {view, wfsLayers, wmsSource} from "../map/openlayers_map";
import styled from "styled-components";
import LayerSelect from "./LayerSelect";
import {createNodeLink} from "../action/NodeLink";
import {drawInteraction, drawLayer} from "../mode/draw";
import {GML, WFS} from "ol/format";
import {Geometry} from "ol/geom";
import {Feature, Map} from "ol";
import {modifyMode} from "../mode";
import MapPopup from "./MapPopup";

function MapInfoBox() {
    const {instance: map, isLoading} = useContext(MapContext);
    const [bbox, setBbox] = useState([] as number[]);
    const [currentPoint] = useState([] as number[])
    const [infoString, setInfoString] = useState("")
    const epsgString = useMemo(() => {
        return isLoading ? null : map.getView().getProjection().getCode()
    }, [isLoading])

    useEffect(() => {
        if (isLoading) return () => {

        };

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
        map.on('singleclick', (e) => {
            createNodeLink(e, map)
            map.forEachFeatureAtPixel(e.pixel, f => {
                MapPopup();
                return f;
            })
        })

        modifyMode.on('modifyend', e => {
            let targetElements: Feature[] = e.features.getArray()
            targetElements.forEach(e => {
                e.setGeometryName("test_point");
            })
            const node = new WFS().writeTransaction([], targetElements, [], {
                featureNS: "http://www.opengeospatial.net/cite",
                featurePrefix: "test_point",
                featureType: "gisexample",
                nativeElements: [],
                version: "1.1.0",
                srsName: "EPSG:3857",
            });
            fetch("http://localhost:80/geoserver/wfs", {
                method: "POST",
                body: new XMLSerializer().serializeToString(node),
            }).then(res => res.json()).then(data => console.log(data));
        })

    }, [isLoading]);
    const handleOnClickResearchButton = () => {
        map.removeLayer(wfsLayers);
        map.addLayer(wfsLayers);
    }

    const handleOnClickDrawStart = () => {
        map.addLayer(drawLayer);
        map.addInteraction(drawInteraction);
        drawInteraction.on('drawend', (e) => {
            let feature: Feature<Geometry> | null = e.feature;

            feature?.set("my_name", "qotndk");

            // 아래 방식은 안된다. drawInteraction에서 직접 추가하기
            // feature?.setGeometryName("test_point");

            const node = new WFS().writeTransaction([feature], [], [], {
                featureNS: "http://www.opengeospatial.net/cite",
                featurePrefix: "test_point",
                featureType: "gisexample",
                version: "1.1.0",
                srsName: "EPSG:3857",
            });

            fetch("http://localhost:80/geoserver/wfs", {
                method: "POST",
                body: new XMLSerializer().serializeToString(node),
            }).then(res => res.json()).then(data => console.log(data));
        })
    }
    const handleOnClickDrawStop = () => {
        map.removeLayer(drawLayer);
        map.removeInteraction(drawInteraction);
    }
    return <MapInfoBoxTemplate>
        <LayerSelect></LayerSelect>
        <div className={''}>
            {epsgString}
        </div>
        <div dangerouslySetInnerHTML={{__html: infoString}}></div>
        <div>
            현재 BBOX:
            <input type={'text'} value={bbox.map(e => e + ":")} readOnly/>
        </div>
        <div>
            마우스 위치 :
            <input type={'text'} value={currentPoint.map(e => e.toString())} readOnly/>
        </div>
        <button onClick={handleOnClickResearchButton}>검색</button>
        <button onClick={handleOnClickDrawStart}>그리기 시작</button>
        <button onClick={handleOnClickDrawStop}>그리기 멈추기</button>
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