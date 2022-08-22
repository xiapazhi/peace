/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import SliderChartTimeLine from './slider-chart-time-line';
import moment from 'moment';

class EventScoreResultChart extends Component {
    constructor(props) {
        super(props);
    }

    getSeries = () => {
        let data = [];
        const { scores } = this.props;
        if (scores && scores.length) {
            data = scores.map(score => {
                const { scoreTime, scoreValue, scoreData } = score;
                return {
                    name: '0 - 80',
                    time: scoreTime,
                    value: scoreValue,
                    extras: {
                        rainstorm: scoreData.rainStormScore,
                        rainfall: scoreData.fallRainScore,
                        earthquake: scoreData.earthquakeScore,
                        platformAlarm: scoreData.warnScore
                    }
                };
            });
        }
        return data;
    };

    render() {
        const { scores, time } = this.props;

        let exportImageName = scores[0].structName
            + `\(${moment(time.start).format('YYYYMMDDHHmmss')}\~${moment(time.end).format('YYYYMMDDHHmmss')}\)`
            + `-${moment(time.now).format('YYYYMMDDHHmmssSSS')}`;

        let values = scores.filter(s => typeof s.scoreValue == 'number').map(s => s.scoreValue);
        let valueMax = Math.max(...values);

        return (
            <div>
                <SliderChartTimeLine
                    container='chart-container'
                    data={this.getSeries()}
                    alarmThreshold={80}
                    timeRange={{ start: scores[0].scoreTime, end: scores[scores.length - 1].scoreTime }}
                    valueRange={{ min: 0, max: valueMax }}
                    configs={{
                        height: 300,
                        padding: [20, 130, 80, 130],
                        slider: { container: 'chart-slider' },
                        exporter: { image: { name: exportImageName } }
                    }}
                />
            </div>
        );
    }
}

export default EventScoreResultChart;
