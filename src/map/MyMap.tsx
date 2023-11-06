import {useEffect, useState} from "react";
import MapContext from "./MapContext";
import {OSMlayers, view} from "./openlayers_map";
import {Map as OlMap} from 'ol';

interface MapObj {
    isLoading: boolean,
    error: {},
    instance: OlMap
}

type MyMapProps = {
    children: React.ReactNode
}
const MyMap = ({children}: MyMapProps) => {
    const [mapObj, setMapObj] = useState<MapObj>({
        isLoading: true,
        error: {},
        instance: {}
    } as MapObj);
    useEffect(() => {
        try {
            setMapObj(prevState => {
                return {...prevState, isLoading: true}
            });
            // Map 객체 생성 및 OSM 배경지도 추가
            const map: OlMap = new OlMap({
                layers: OSMlayers,
                target: 'map', // 하위 요소 중 id 가 map 인 element가 있어야함.
                view: view,
            });

            setMapObj(prevState => {
                return {...prevState, instance: map}
            });
            return () => map.setTarget(undefined);
        } catch (e) {
            setMapObj(prevState => {
                return {...prevState, isLoading: false}
            });
        } finally {
            setMapObj(prevState => {
                return {...prevState, isLoading: false}
            });
        }
    }, []);
    return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>
}
export default MyMap;