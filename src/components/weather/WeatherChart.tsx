import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getHourLabel, getTimeLabel } from "@/utils/reformatTime";
import { getWeatherCodeIcon } from "@/utils/weatherCodeDescriptions";


type WeatherChartProps = {
    time: string[];
    currentTime: string;
    temperature: number[];
    precipitation: number[];
    weatherCode: number[];
    isDay: number[];
};

const WeatherChart = ({ time, currentTime, temperature, precipitation, weatherCode, isDay }: WeatherChartProps) => {

    // Reformat time for x-axis labels
    let formattedTime = time.map((t: string) =>
        getHourLabel(t) === "00:00" ? getTimeLabel(t) : getHourLabel(t)
    );

    // Find the index of the current time in the time array
    let currentIndex = time.indexOf(currentTime.slice(0, -2).concat("00"));
    currentIndex += Number(currentTime.slice(-2)) / 60;

    ///// Crop arrays
    const graphLenght = 20;
    let pastHours = 1; // Number of past hours to show
    if (currentIndex <= pastHours)
        pastHours = 0;
    time = time.slice(currentIndex - pastHours, graphLenght + currentIndex);
    formattedTime = formattedTime.slice(currentIndex - pastHours, graphLenght + currentIndex);
    temperature = temperature.slice(currentIndex - pastHours, graphLenght + currentIndex);
    precipitation = precipitation.slice(currentIndex - pastHours, graphLenght + currentIndex);
    weatherCode = weatherCode.slice(currentIndex - pastHours, graphLenght + currentIndex);
    isDay = isDay.slice(currentIndex - pastHours, graphLenght + currentIndex);
    currentIndex -= currentIndex - currentIndex % 1 - pastHours;

    ///// Filtering labels to skip
    const XAxisStep = 3; // Number of labels to skip on the x-axis
    const tickPositions = formattedTime
        .map((t: string, index: number) => {
            if (t.includes(" "))
                return index;
            else if (Number(t.slice(0, 2)) % XAxisStep === 0)
                return index;
            return undefined;
        })
        .filter((v): v is number => v !== undefined);

    ///// Icon array
    const weatherCodeIcons = weatherCode.map((code: number, index: number) => getWeatherCodeIcon(code, isDay[index]));

    const options: Highcharts.Options = {
        chart: {
            type: "line",
            backgroundColor: "#dad7cd",
            style: { fontFamily: "inherit", fontSize: "1.2rem", fontWeight: "bold", color: "#333" }
        },
        title: { text: undefined },
        xAxis: [{
            categories: formattedTime,
            tickPositions: tickPositions,
            plotLines: currentIndex >= 0 ? [
                {
                    color: "#d90429",
                    width: 2,
                    value: currentIndex,
                    label: {
                        text: currentTime.slice(-5),
                    }
                }
            ] : []
        }, {
            categories: weatherCodeIcons,
            labels: {
                useHTML: true,
                rotation: 0,
                enabled: true,
                formatter: function () {
                    // adding darkening filter to the fog icon for better visibility
                    if (this.value === "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog.svg")
                        return `<img src="${this.value}" style="height:60px;vertical-align:center;horizontal-align:center;display:block;margin:0 auto;margin-bottom:-15px;filter:brightness(0.8);">`;
                    // else
                    return `<img src="${this.value}" style="height:60px;vertical-align:center;horizontal-align:center;display:block;margin:0 auto;margin-bottom:-15px;">`;
                }
            },
            // tickInterval: 2,
            opposite: true,
            linkedTo: 0 // doesn't render without this
        }],
        yAxis: [
            {
                title: { text: "Temperature" },
                labels: { format: '{value}°C' },
                softMax: 20
            },
            {
                title: { text: "Precipitación" },
                labels: { format: '{value} mm' },
                softMax: 6,
                gridLineColor: "#777777",
                opposite: true
            }
        ],
        series: [
            {
                name: "Temperature",
                type: "areaspline",
                data: temperature,
                color: "#FFA500",
                fillOpacity: 0.3,
                yAxis: 0
            },
            {
                name: "Precipitación",
                type: "areaspline",
                data: precipitation,
                color: "#00BFFF",
                fillOpacity: 0.4,
                yAxis: 1,
                xAxis: 0
            }
        ],
        credits: { enabled: false }
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { width: "100%", height: "100%" } }}
        />
    );
}

export default WeatherChart;