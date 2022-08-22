import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { DEFAULT_COLOR } from './constants';

function BarChart(props) {

    const {
        data, xAxis, height, width, 
    } = props;


    const option = {
        color: DEFAULT_COLOR,
       
        grid: {
            left: '3%',
            right: '1%',
            top: '10%',
            bottom: '0%',
            containLabel: true,
        },
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12,
                interval: 0,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },

            data: xAxis || ['大(一)型水库', '大(二)型水库', '中型水库', '小(一)型水库', '小(二)型水库'],

        },

        yAxis: {
            splitLine: {
                lineStyle: {
                    type: "dashed",
                    color: "rgba(56, 119, 242, 0.2)"
                }
            },

            nameTextStyle: {
                color: "#fff"
            },
            gridIndex: 0,

            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#fff',
                formatter: '{value}'
            },
            type: 'value',
            minInterval: 1,

        },
        series: [
            {

                type: 'bar',
                barMaxWidth: 'auto',

                barWidth: 25,
                yAxisIndex: 0,
                data: data,

                label: {

                    show: true,
                    position: 'top',
                    textStyle: {
                        color: "#ffffff",
                        fontSize: "14",
                    },

                },
                itemStyle: {
                    color: '#3877F2',
                },
                showBackground: true,
                backgroundStyle: {
                    color: '#0B2A67'
                }

            },

        ]
    }



    return (
        <ReactEcharts
            option={option}
            notMerge
            lazyUpdate
            style={{ height: height || 241, width: width || 'auto' }}

        />
    )
}

export default BarChart