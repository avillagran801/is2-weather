import React from "react";
import { Card, CardContent } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getHourLabel, getTimeLabel } from "@/utils/reformatTime";
import { getWeatherCodeDescriptions, getWeatherCodeIcon } from "@/utils/weatherCodeDescriptions";
import { X } from "@mui/icons-material";


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

    ///// Crop how many pasta hours are shown
    const pastHours = 1; // Number of past hours to show
    if (currentIndex > pastHours) {
        time = time.slice(currentIndex - pastHours);
        formattedTime = formattedTime.slice(currentIndex - pastHours);
        temperature = temperature.slice(currentIndex - pastHours);
        precipitation = precipitation.slice(currentIndex - pastHours);
        weatherCode = weatherCode.slice(currentIndex - pastHours);
        isDay = isDay.slice(currentIndex - pastHours);
        currentIndex -= currentIndex - currentIndex % 1 - pastHours;
    }

    ///// Filtering labels to skip
    const XAxisStep = 4; // Number of labels to skip on the x-axis
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
    const iconTickPosition = [-1, 0];
    for (let index = 1; index < weatherCodeIcons.length - 1; index++)
        if (weatherCodeIcons[index] !== weatherCodeIcons[index - 1] || weatherCodeIcons[index] !== weatherCodeIcons[index + 1])
            iconTickPosition[index] = index;


    ///// Insert icons into precipitation data
    // let formattedPrecipitation: Array<any>;
    // formattedPrecipitation = precipitation;
    // for (let index = 0, priorIcon = "_"; index < precipitation.length; index++) {
    //     const icon = getWeatherCodeIcon(weatherCode[index], isDay[index]);
    //     if (priorIcon !== icon || true) {
    //         priorIcon = icon;
    //         formattedPrecipitation[index] = {
    //             y: precipitation[index],
    //             marker: {
    //                 symbol: 'url(' + icon + ')',
    //                 width: 60,
    //                 height: 60
    //             },
    //         }
    //     }
    // }

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
                format: '<img src="{text}" style="width: 50px; margin-bottom: -15px; margin-top: -10px">',
                useHTML: true,
                rotation: 0,
                allowOverlap: false
            },
            // tickPositions: iconTickPosition,
            opposite: true
        }],
        yAxis: [
            {
                title: { text: "Temperature" },
                labels: { format: '{value}°C' },
            },
            {
                title: { text: "Precipitación" },
                labels: { format: '{value} mm' },
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
                fillOpacity: 0.1,
                yAxis: 0
            },
            {
                name: "Precipitación",
                type: "areaspline",
                data: precipitation,
                color: "#00BFFF",
                fillOpacity: 0.2,
                marker: { symbol: 'square' },
                yAxis: 1,
                xAxis: 1
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