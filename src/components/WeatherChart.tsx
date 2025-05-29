import React from "react";
import { Card, CardContent } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// declare all data at the top
const time = [
  "27 May", "06:00", "12:00", "18:00",
  "28 May", "06:00", "12:00", "18:00"
];

const temperatureData = [12, 14, 20, 18, 15, 13, 19, 17];
const uvIndexData = [1, 2, 5, 4, 1, 3, 6, 2];
const humidityData = [80, 78, 60, 65, 70, 75, 55, 60];
const windSpeedData = [10, 12, 20, 15, 8, 6, 14, 10];

export default function WeatherChart() {
  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "#dad7cd",
      style: { fontFamily: "inherit" }
    },
    title: { text: undefined },
    xAxis: {
      categories: time,
      labels: { style: { color: "#333" } },
      gridLineColor: "#333"
    },
    yAxis: [
      {
        title: { text: "°C", style: { color: "#333" } },
        labels: { style: { color: "#333" } },
        gridLineColor: "#444"
      },
      {
        title: { text: "mm", style: { color: "#333" } },
        labels: { style: { color: "#333" } },
        // opposite: true
      }
    ],
    legend: {
      itemStyle: { color: "#333" }
    },
    series: [
      {
        name: "Temperature",
        type: "line",
        data: humidityData,
        color: "#FFA500",
        yAxis: 0
      },
      {
        name: "Precipitación",
        type: "area",
        data: temperatureData,
        color: "#00BFFF",
        fillOpacity: 0.2,
        yAxis: 1
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