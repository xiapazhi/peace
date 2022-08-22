import React, { Component } from 'react';
import * as echarts from 'echarts';

class GeneraLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const { xAxis, water, designFloodLevel } = this.props;
        this.createCharts(xAxis, water, designFloodLevel);
    }

    createCharts = (xAxis, water, designFloodLevel) => {
        this.clearEchart();
        let chartDom = document.getElementById(this.props.DOMID);
        this.chart = echarts.init(chartDom);

        let option = this.getOption(xAxis, water, designFloodLevel);
        this.chart.setOption(option);
    };

    clearEchart = () => {
        if (this.chart) {
            this.chart.dispose();
        }
    };

    getOption = (xAxis, water, designFloodLevel) => {
        console.log(parseFloat(designFloodLevel))
        console.log(isNaN(parseFloat(designFloodLevel)))
        let markLine = designFloodLevel && !isNaN(parseFloat(designFloodLevel)) ? {
            silent: true,
            data: [{
                yAxis: parseFloat(designFloodLevel)
            }],
            symbol: 'none',//去掉箭头
            lineStyle: {//标注线样式
                normal: {
                    type: 'dashed',
                    color: 'rgba(49, 240, 246, 1)',//标注线颜色
                },
            },
            label: {
                formatter: '设计洪水位',
                position: 'insideEndTop',
                color: '#fff'
            },
        } : {}
        let option = {
            color: ['0048D9', '#1ca2fb'],
            tooltip: {
                trigger: 'axis',
            },
            legend: false,
            grid: {
                left: "17%",
                right: "3%",
                bottom: "16%",
                top: "13%",
                // containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel: { color: '#F3FFFF' },//y轴文字颜色
            },
            yAxis: [
                {
                    name: '水位/m',
                    nameTextStyle: {
                        color: '#F3FFFF'
                    },
                    type: 'value',
                    axisLabel: { color: '#F3FFFF' },//y轴文字颜色,
                    max: designFloodLevel || 0,
                    min: this.props.hbgd || 0,
                    splitLine: {    //网格线
                        lineStyle: {
                            type: 'dashed',    //设置网格线类型 dotted：虚线   solid:实线
                            color: 'rgba(0, 72, 217, 0.5)'
                        },
                        show: true //隐藏或显示
                    }
                }
            ],
            series: [
                {
                    name: '水位',
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    lineStyle: {
                        color: '#0048D9'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 72, 217, 0.99)'
                        }, {
                            offset: 1,
                            color: 'rgba(0, 72, 217, 0)'
                        }])
                    },
                    data: water,
                    markLine: markLine
                },
            ]
        };
        return option;
    };

    render() {
        const { height, DOMID } = this.props;
        return <div id={DOMID} style={{ height: height }} />;
    }
}

export default GeneraLine;