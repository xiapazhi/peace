import React, { useRef, useState, useEffect } from 'react';
import { Row } from 'antd';
import ProCard from '@ant-design/pro-card';
import {
  Amap, CircleMarker, InfoWindow, Marker,
} from '@amap/amap-react';
import { Func } from '$utils';

function Gis(props) {
  const {
    gisStructures, structuresList = [], userAlarmsInfo, loading,
  } = props;
  const mapRef = useRef();
  const iWindowRef = useRef();
  const [selectStructure, setSelectStructure] = useState(null);
  const alarmColor = ['#39CD6A', '#F31C1C', '#FE812C', '#FADF37', '#801CF3', '#39CD6A']; // 数据内告警颜色顺序[正常,1级,2级,3级,4级] -- 安心云为3级--需求是4级

  useEffect(() => {
    // if (mapRef.current) {
    //   // mapRef.current.setFitView();
    // }

    if (iWindowRef && iWindowRef.current && gisStructures && gisStructures.length > 1) {
      iWindowRef.current.close();
    }
  }, [gisStructures]);

  const onMarkerClick = (s) => {
    setSelectStructure(s);
    mapRef.current.setCenter([s.longitude, s.latitude]);
  };

  const circleMarker = () => {
    const markerList = [];
    if (gisStructures?.length > 0) {
      gisStructures.map((s, index) => {
        let curMaxLevel = 5;
        if (userAlarmsInfo && userAlarmsInfo.alarms && userAlarmsInfo.alarms.length && userAlarmsInfo?.alarms.length > 0) {
          userAlarmsInfo.alarms.map((alarmStruct) => {
            if (alarmStruct.structureId == s.id && alarmStruct?.alarms.length > 0) {
              alarmStruct.alarms.map((alarm) => {
                if (alarm.state != 3 && curMaxLevel > alarm.level) {
                  curMaxLevel = alarm.level;
                }
              });
            }
          });
        }
        const markColor = alarmColor[curMaxLevel];
        const markerStyle = {
          background: `url(/assets/images/screen/marker-${curMaxLevel}.png)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '30px',
          height: '40px',
          color: '#000',
          textAlign: 'center',
          lineHeight: '40px',
        };
        markerList.push(
          <Marker
            key={index}
            // center={[s.longitude, s.latitude]}
            position={[s.longitude, s.latitude]}
            onClick={(e) => onMarkerClick(s)}
          >
            <div style={markerStyle} />
          </Marker>,
        );
      });
    }
    if (mapRef.current) {
      // mapRef.current.setFitView();
    }
    return markerList;
  };

  const renderInfoWindow = (struct) => {
    if (struct && struct.id) {
      const portrait = struct && struct.portrait && Func.downloadFile(struct.portrait);
      return (
        <InfoWindow
          ref={iWindowRef}
          position={[struct.longitude, struct.latitude]}
          autoMove
          closeWhenClickMap
          isCustom
          onClose={() => setSelectStructure(null)}
          offset={[0, -40]}
        >
          <div className="gis-infowindow">
            <div className="title">
              <img className="img" src="/assets/images/screen/gis_icon.png" />
              <span style={{ lineHeight: 2 }} title={struct?.name}>{struct?.name.substring(0, 10)}</span>
            </div>
            <img onClick={() => setSelectStructure(null)} className="close" src="/assets/images/screen/close.png" />
            <div className="content">
              <div>
                <span className="left">水库类型：</span>
                <span className="right">{struct?.extraInfo?.reservoirType}</span>
              </div>
              <div>
                <span className="left">水库编码：</span>
                <span className="right">{struct?.extraInfo?.number}</span>
              </div>
              <div>
                <span className="left">水库状态：</span>
                <span className="right">{struct?.extraInfo?.reservoirState}</span>
              </div>
              <div>
                <span className="left">坝    型：</span>
                <span className="right">{struct?.extraInfo?.damType}</span>
              </div>
              <div>
                <span className="left">坝    长：</span>
                <span className="right">{struct?.extraInfo?.reservoirLength}</span>
              </div>
              <div>
                <span className="left">坝    高：</span>
                <span className="right">{struct?.extraInfo?.damHeight}</span>
              </div>
              <div>
                <span className="left">兴利库容：</span>
                <span className="right">{struct?.extraInfo?.xlkr}</span>
              </div>
              <div>
                <span className="left">汛限水位：</span>
                <span className="right">{struct?.extraInfo?.xxsw}</span>
              </div>
              <img
                style={{ width: 200, height: 102, marginTop: 20 }}
                src={portrait}
              />
            </div>
          </div>
        </InfoWindow>
      );
    }
  };

  return (
    !loading && (
      <Amap
        ref={mapRef}
        mapStyle="amap://styles/24d1e9ed55db018489c6a826b98c8094"
        onComplete={(map) => {
          setTimeout(() => {
            map.setFitView();
          }, 500);
        }}
      >
        {circleMarker()}
        {renderInfoWindow(selectStructure)}
      </Amap>
    )
  );
}

export default Gis;
