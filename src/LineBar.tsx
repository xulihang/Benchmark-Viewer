import { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';

const LineBar = (props: any)=>{
    const [scoreOptions, setScoreOptions] = useState({});
    const dataKey:string = props.dataKey;
    const enginesArray:any[] = props.enginesArray;
    let engine_names:string[] = [];

    useEffect(() => {
        load_engines();
        setScoreOptions(getOption());
    }, [props.enginesArray]);
    
    const load_engines = () => {
        for (let i=0; i<enginesArray.length; i++){
            engine_names.push(enginesArray[i].name);
        }
    }

    const get_series = () => {
        let series = [];
        const labelOption = {
            show: true,
            position: 'top'
        };
        for (let i=0; i<enginesArray.length; i++){
            let engine = enginesArray[i].name;
            let serie = {
                name: engine, 
                type: 'bar', 
                barGap: 0, 
                label: labelOption, 
                emphasis: {
                    focus: 'series'
                },
                data: [enginesArray[i][dataKey]]
            }
            series.push(serie);
        }
        return series;
    }
    const getOption = () => {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: engine_names
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: [dataKey]
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: get_series()
        };
        return option;
    }

    return (
        <ReactECharts option={scoreOptions} style={props.style}/>
    )
}

export default LineBar;

