import React, { Component } from 'react';
import * as echarts from 'echarts';

class ColumnChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const { xAxis, data } = this.props;
        // let xAxis = ['12', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        // let data = [120, 200, 150, 80, 70, 110, 130]
        this.createCharts(xAxis, data);
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    // }

    createCharts = (xAxis, data) => {
        this.clearEchart();
        let chartDom = document.getElementById(this.props.DOMID);
        this.chart = echarts.init(chartDom);

        let option = this.getOption(xAxis, data);
        this.chart.setOption(option);
    };

    clearEchart = () => {
        if (this.chart) {
            this.chart.dispose();
        }
    };

    getOption = (xAxis, data) => {
        let option = {
            tooltip: {
                trigger: 'item',
                position: 'top'//提示框浮层的位置
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel: { color: 'rgba(255, 255, 255)' },//y轴文字颜色
            },
            grid: {
                right: "3%",
                bottom: "16%",
                top: "13%",
            },
            yAxis: {
                name: 'mm',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255)'
                },
                type: 'value',
                scale: true,
                axisLabel: { color: 'rgba(255, 255, 255)' },

                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(185, 200, 218, 0.8)',//左边线的颜色
                        width: '1'//坐标线的宽度
                    }
                },
                splitLine: {    //网格线
                    lineStyle: {
                        type: 'dashed',    //设置网格线类型 dotted：虚线   solid:实线
                        color: 'rgba(0, 72, 217, 0.5)'
                    },
                    show: true //隐藏或显示
                }
            },
            series: [{
                data: data,
                type: 'bar',
                barWidth: 10,//柱图宽度
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#3877F2' },
                            { offset: 0.7, color: '#3877F2' },
                            { offset: 1, color: '#3877F2' }
                        ]
                    )
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#01A8F7' },
                                { offset: 0.7, color: '#01A8F7' },
                                { offset: 1, color: '#01A8F7' }
                            ]
                        )
                    }
                },
            }]
        };
        return option;
    };

    render() {
        const { height, DOMID } = this.props;
        return <div id={DOMID} style={{ height: height }} />;
    }
}

export default ColumnChart;