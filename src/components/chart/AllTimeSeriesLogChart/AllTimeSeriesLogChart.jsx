// import { useGetCharInfo } from "../../../hooks/chart/useGetChartInfo";
import { useMemo, useRef, useState } from "react";
import React from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import { format } from "date-fns";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { useGetChartAllData } from "../../../hooks/chart/useGetChartAllData";
const ONE_HOUR = 60 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
function AllTimeSeriesLogChart() {
  const { data, isSuccess, isLoading } = useGetChartAllData({ cc_idx: 21 });
  const chartRef = useRef(null);
  const [chartHour, setChartHour] = useState(12);

  if (isLoading || !data) {
    return <div className="flex">loading...</div>;
  }

  const now = new Date(data?.timecode_datetime).getTime();

  const chartCallback = (chart) => {
    if (chart && chart !== chartRef.current) {
      chartRef.current = chart;
    }
  };
  const scaleFactor = chartHour / 144;

  const aiPriceSeries = [
    {
      data: data.ai_price_1h_chart.slice(
        -Math.max(13, Math.round(150 * scaleFactor))
      ),
    },
    {
      data: data.ai_price_2h_chart.slice(
        -Math.max(14, Math.round(156 * scaleFactor))
      ),
    },
    {
      data: data.ai_price_3h_chart.slice(
        -Math.max(15, Math.round(162 * scaleFactor))
      ),
    },
    {
      data: data.ai_price_4h_chart.slice(
        -Math.max(16, Math.round(168 * scaleFactor))
      ),
    },
    {
      data: data.ai_price_5h_chart.slice(
        -Math.max(17, Math.round(174 * scaleFactor))
      ),
    },
    {
      data: data.ai_price_6h_chart.slice(
        -Math.max(18, Math.round(180 * scaleFactor))
      ),
    },
  ];

  const processData = (datasets, now) => {
    const minMaxData = [];

    const maxLength = Math.max(...datasets.map((d) => d.length));
    console.log("maxLength", maxLength);

    for (let i = 0; i < maxLength; i++) {
      // 🔹 데이터가 없는 경우 `filter(Boolean)`으로 제거
      const valuesAtIndex = datasets.map((d) => d[i]).filter(Boolean);
      const min = Math.min(...valuesAtIndex);
      const max = Math.max(...valuesAtIndex);

      if (!isNaN(min) && !isNaN(max)) {
        const timestamp =
          now - (data.week_price_chart.length - 1 - i) * TEN_MINUTES;

        console.log(timestamp);
        minMaxData.push([timestamp, min, max]);
      }
    }

    return minMaxData;
  };
  const processedData = processData(
    aiPriceSeries.map((d) => d.data),
    now
  );

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
        name: `${index + 1}시간 전에 예측한 값`,
        data: item.data.slice(0, item.data.length - 1).map((value, i) => ({
          x: now - (data.week_price_chart.length - 1 - i) * 1 * TEN_MINUTES,
          y: value,
          color: "#6DC9FF",
        })),
        marker: {
          symbol: "circle",
          radius: 3,
          fillColor: "#fff",
          lineWidth: 2,
          lineColor: "#6DC9FF",
        },

        lineWidth: 1,
        lineColor: "#6DC9FF",
      })),
      {
        type: "arearange",
        name: "예측 범위",
        data: processedData,
        color: "rgba(150, 200, 250, 0.8)",
        fillOpacity: 0.2,
        enableMouseTracking: false,
        lineWidth: 0,
        marker: {
          enabled: false,
        },
        zIndex: 0,
        states: {
          inactive: {
            opacity: 1,
          },
        },
        showInLegend: false,
      },

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
            radius: 5,
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
        data: data.week_price_chart.slice(-chartHour).map((item, index) => {
          const ago = (data.week_price_chart.length - 1 - index) * 1;
          const timestamp = now - ago * TEN_MINUTES;
          return [timestamp, item];
        }),

        color: "#45B341",
        lineWidth: 3,
        // marker: {
        //   enabled: false,
        // },
        marker: {
          symbol: "circle",
          radius: 4,
          fillColor: "#45B341",
          lineWidth: 2,
          lineColor: "transparent",
          // enabled: false,
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>All Time Series Log Chart</h2>
        <div className="flex gap-2.5">
          <button
            className={`${chartHour === 12 && "bg-[#646cff] text-white"}`}
            onClick={() => setChartHour(12)}
          >
            12H
          </button>
          <button
            className={`${chartHour === 24 && "bg-[#646cff] text-white"}`}
            onClick={() => setChartHour(24)}
          >
            1D
          </button>
          <button
            className={`${chartHour === 144 && "bg-[#646cff] text-white"}`}
            onClick={() => setChartHour(144)}
          >
            6D
          </button>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
export default AllTimeSeriesLogChart;
