import ReactEcharts from "echarts-for-react";

export default function DoughnutChart({height = []}) {
    const defaultColor = ['#dadcfc', '#c1c5fb', '#959bf7', '#717CFF'];

    const option = {
        legend: {
            show: true,
            itemGap: 20,
            icon: "circle",
            bottom: 0,
            textStyle: {color: defaultColor, fontSize: 13, fontFamily: "roboto"},
            padding: 0
        },
        tooltip: {show: false, trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)"},
        xAxis: [{axisLine: {show: false}, splitLine: {show: false}}],
        yAxis: [{axisLine: {show: false}, splitLine: {show: false}}],

        series: [
            {
                name: "Traffic Rate",
                type: "pie",
                radius: ["55%", "70%"],
                center: ["50%", "50%"],
                avoidLabelOverlap: false,
                hoverOffset: 5,
                stillShowZeroSum: false,
                label: {
                    normal: {
                        show: false,
                        position: "center",
                        textStyle: {fontSize: 13, fontFamily: "roboto"},
                        formatter: "{a}"
                    },
                    emphasis: {
                        show: true,
                        textStyle: {fontSize: "14", fontWeight: "normal"},
                        formatter: "{b} \n{c} ({d}%)"
                    }
                },
                labelLine: {normal: {show: false}},
                data: [
                    {value: 130, name: "Google"},
                    {value: 40, name: "Facebook"},
                    {value: 20, name: "TikTok"},
                    {value: 10, name: "Others"}
                ],
                itemStyle: {
                    emphasis: {shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)"}
                }
            }
        ]
    };

    return <ReactEcharts style={{height: height}} option={{...option, color: defaultColor}}/>;
}
