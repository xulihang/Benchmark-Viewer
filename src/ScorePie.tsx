import { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import { isPropertySignature } from "typescript";

const ScorePie = (props: any)=>{
    const chartId:string = props.chartId;
    const score:number = props.score;
    var options= {
        title: {
        show: true,
        text: chartId,
        x: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16
        }
        },
        animation: true,
        tooltip: {
        show: false
        },
        series: [
        {
            name: chartId,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            silent: true,
            labelLine: {
            normal: {
                show: false
            }
            },
            data: [
            {
                value: score,
                name: chartId,
                selected: false,
                label: {
                normal: {
                    show: true,
                    position: 'center',
                    fontSize: 20,
                    formatter: '{b}\n{d}%'
                }
                },
                itemStyle: {
                color: '#91c7ae'
                }
            },
            {
                value: 100-score,
                label: {
                normal: {
                    show: false
                }
                },
                itemStyle: {
                color: '#eee'
                }
            }
            ]
        }
        ]
    };
    const [scoreOptions, setScoreOptions] = useState(options);

    return (
        <ReactECharts option={scoreOptions} style={props.style}/>
    )
}

export default ScorePie;