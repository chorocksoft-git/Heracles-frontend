import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import data from "../../../../data.json";
import { format } from "date-fns";
const dataset = [
  {
    time: "1 Hour",
    data: data.oneHour_week_price_chart,
  },
  {
    time: "2 Hour",
    data: data.twoHour_week_price_chart,
  },
  {
    time: "3 Hour",
    data: data.threeHour_week_price_chart,
  },
  {
    time: "4 Hour",
    data: data.fourHour_week_price_chart,
  },
  {
    time: "5 Hour",
    data: data.fiveHour_week_price_chart,
  },
  {
    time: "6 Hour",
    data: data.sixHour_week_price_chart,
  },
];

const options = {
  chart: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    type: "areaspline",
    height: 600,
    spacingRight: 0,
    spacingLeft: 0,
    style: {
      fontSize: "13px",
      marginTop: "9px",
    },
  },
  title: { text: "" },
  credits: { enabled: false },
  xAxis: {
    type: "datetime",
    labels: {
      formatter() {
        return format(new Date(this.value), "MM-dd HH:mm");
      },
    },
    allowDecimals: false,
    endOnTick: false,
    ordinal: false,
    startOnTick: false,
  },
  yAxis: [
    {
      tickAmount: 10,
      labels: {
        formatter() {
          return this.value;
        },
      },
      title: { text: "" },
      gridLineWidth: 1,
      opposite: true,
      startOnTick: false,
    },
  ],
  tooltip: {
    crosshairs: true,
    shared: true,
    split: true,
    formatter: function (tooltip) {
      const { x, points, color } = this;
      const formatHtml = tooltip.defaultFormatter.call(this, tooltip);

      return formatHtml.map((html, idx, arr) => {
        if (html === "") return "";
        if (idx === 0)
          return `<span style="font-size: 10px;">${format(
            x,
            "yyyy-MM-dd HH:mm"
          )}</span><br/>`;

        const point = points?.find((p, i) => html.includes(p.color));

        return `<span style="color:${point?.color}">●</span>
                <span style="font-size: 10px;"> 
                 ${point?.y}
                </span><br/>`;
      });
    },
  },

  series: [
    ...dataset.map((item, index) => ({
      type: "scatter",
      name: item.time,
      data: item.data.map((value, i) => [i, value]), // 시간대에 맞게 X,Y 데이터 매핑
      marker: {
        radius: 4,
        fillColor: "#007EC8", // 점의 색상
        lineWidth: 2,
        lineColor: "transparent",
        symbol: "circle",
      },
    })),
    {
      type: "line",
      name: "실제가격",
      data: data.week_price_chart,
      zIndex: 1,
      type: "line",
      color: "#45B341",
      marker: {
        enabled: false,
      },
    },
  ],
};

function MultiTimeSeriesLogChart() {
  return (
    <div>
      <h2>Multiple Time Prediction Values</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default MultiTimeSeriesLogChart;
