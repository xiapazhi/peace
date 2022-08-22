import React, { Component } from 'react';
import HistoryChart from './history/history-chart';
import WindChart from './history/wind-chart';
import VibrationChart from './history/vibrationChart';
import RainChart from './history/rain-chart';

const FacotorModule = ({ ...props }) => {
    const {
        factorProto, data, windroseData, vibrationRawsData, vibrationFftsData,
    } = props;
    data.map((s) => {
        s.stations.map((x) => {
            x.data = x.data.filter((v) => JSON.stringify(v.values) != '{}');
            return x;
        });
    });
    const getFactorModuleCharts = () => {
        switch (factorProto) {
            
            case '1001': // 风速风向
                return <WindChart data={data} windroseData={windroseData} />;
            case '5002':
                return <VibrationChart data={data} vibrationRawsData={vibrationRawsData} vibrationFftsData={vibrationFftsData} />;
            case '1003':
                return <RainChart data={data} />;
            case '4005':
            case '4004':
            case '2001':
            case '1007':
            case '2002':
            case '5001':
            // case '5003':
            case '5005':
            case '5003':
            case '5006':// 爆破振动
            case '1009':
            default:
                return <HistoryChart data={data} />;
                break;
        }
    };

    return (
        getFactorModuleCharts()
    );
};

export default FacotorModule;
