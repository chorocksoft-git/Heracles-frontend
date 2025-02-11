// import { useGetCharInfo } from "../../../hooks/chart/useGetChartInfo";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { format } from "date-fns";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { useGetChartAllData } from "../../../hooks/chart/useGetChartAllData";
const ONE_HOUR = 60 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
function AllTimeSeriesLogChart() {
  const { data, isSuccess, isLoading } = useGetChartAllData({ cc_idx: 21 });
  const chartRef = useRef(null);
  const [chartHour, setChartHour] = useState(24);

  if (isLoading || !data) {
    return <div className="flex">loading...</div>;
  }

  const now = new Date(data?.timecode_datetime).getTime();

  const chartCallback = (chart) => {
    if (chart && chart !== chartRef.current) {
      chartRef.current = chart;
    }
  };
  const aiPriceSeries = [
    {
      data: data.ai_price_1h_chart,
    },
    {
      data: data.ai_price_2h_chart,
    },
    {
      data: data.ai_price_3h_chart,
    },
    {
      data: data.ai_price_4h_chart,
    },
    {
      data: data.ai_price_5h_chart,
    },
    {
      data: data.ai_price_6h_chart,
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
      events: {
        load() {
          chartCallback(this);
        },
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
            return numberWithCommas(this.value);
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
      borderWidth: 1.5,
      borderRadius: 4,
      formatter: function (tooltip) {
        const { x, points } = this;
        const formatHtml = tooltip.defaultFormatter.call(this, tooltip);
        return formatHtml.map((html, idx, arr) => {
          if (html === "") return "";
          if (idx === 0)
            return `<span style="font-size: 10px;">${format(
              x,
              "yyyy-MM-dd HH:mm"
            )}</span><br/>`;

          const point = points.find((p) => html.includes(p.y));

          console.log(point.y);

          return `<span style="color:${point.color}">●</span>
                    <span style="font-size: 10px;">
                    ${point.series.name}:$ ${numberWithCommas(point.y)}
                    </span><br/>`;
        });
      },
    },

    series: [
      ...aiPriceSeries.map((item, index) => ({
        type: "line",
        name: `${index + 1}시간 뒤 예측값`,
        data: item.data.slice(0, item.data.length - 1).map((value, i) => ({
          x: now - (data.week_price_chart.length - 1 - i) * 1 * TEN_MINUTES,
          y: value,
          color: "#007EC8",
        })),
        marker: {
          symbol: "circle",
          radius: 4,
          fillColor: "#007EC8",
          lineWidth: 2,
          lineColor: "transparent",
        },
        lineWidth: 0,
        lineColor: "transparent",
      })),
      {
        type: "line",
        name: "최신 예측값",
        data: aiPriceSeries.map((item, index) => ({
          x:
            now -
            (data.week_price_chart.length - 1 - (item.data.length - 1)) *
              1 *
              TEN_MINUTES,
          y: item.data[item.data.length - 1],
          symbol: "circle",
          marker: {
            radius: 4,
            fillColor: `rgba(255, 0, 0, ${1 - index * 0.15})`,
            lineWidth: 2,
            lineColor: "transparent",
            symbol: "circle",
          },
        })),
        color: "#ff0000",
        lineWidth: 1,
        lineColor: "transparent",
      },
      {
        type: "line",
        name: "실제가격",
        data: data.week_price_chart.map((item, index) => {
          const ago = (data.week_price_chart.length - 1 - index) * 1;
          const timestamp = now - ago * TEN_MINUTES;
          return [timestamp, item];
        }),

        color: "#45B341",
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <div>
      <h2>Multiple Time Prediction Values</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
export default AllTimeSeriesLogChart;
