import {createContext} from "react";
import {Map as OlMap} from "ol";

interface MapObj {
    isLoading:boolean,
    error:{},
    instance:OlMap
}
const MapContext: React.Context<MapObj> = createContext<MapObj>({isLoading:false,error:{},instance: new OlMap()});
export default MapContext;