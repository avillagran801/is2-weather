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
        title: { text: "Values", style: { color: "#333" } },
        labels: { style: { color: "#333" } },
        gridLineColor: "#444"
      },
      {
        title: { text: "UV Index", style: { color: "#333" } },
        labels: { style: { color: "#333" } },
        opposite: true
      }
    ],
    legend: {
      itemStyle: { color: "#333" }
    },
    series: [
      {
        name: "Temperature (°C)",
        type: "line",
        data: temperatureData,
        color: "#00BFFF",
        yAxis: 0
      },
      {
        name: "UV Index",
        type: "line",
        data: uvIndexData,
        color: "#00FF7F",
        yAxis: 1
      },
      {
        name: "Humidity (%)",
        type: "line",
        data: humidityData,
        color: "#FFA500",
        yAxis: 0
      },
      {
        name: "Wind Speed (km/h)",
        type: "line",
        data: windSpeedData,
        color: "#FF69B4",
        yAxis: 0
      }
    ],
    credits: { enabled: false },
    responsive: {
      rules: [{
        condition: { maxWidth: 600 },
        chartOptions: { legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' } }
      }]
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#dad7cd",
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        marginBottom: 4,
        boxShadow: 3,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}