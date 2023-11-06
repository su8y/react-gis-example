# Gis (Cocobot example)

## file structure
* **map**
    * MyMap.tsx
        * 오픈레이어스 지도 생성 훅
    * openlayers_map.ts
        * 오픈레이어스 리소스 초기화 ts파일

* **coponent**
    * MapInfoBox
        * BBOX 반환
        * 마우스 위치 추적
        * WFS 검색을 통한 Openlayers 피처 생성
    * LayerSelect
        * Layer 선택

## GeoServer

docker hub pull : 
```bash
$ docker pull bsa0530/geoserver:latest
```     

기본 포트: `80`     
접속 url: `/geoserver`

## RUN
```bash
$ npm run start
```