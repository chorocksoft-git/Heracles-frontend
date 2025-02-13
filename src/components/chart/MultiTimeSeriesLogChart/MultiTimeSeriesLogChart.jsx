import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetCharInfo } from "../../../hooks/chart/useGetChartInfo";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { numberWithCommas } from "../../../utils/numberWithCommas";

const ONE_HOUR = 60 * 60 * 1000;

function MultiTimeSeriesLogChart() {
  const { data, isSuccess } = useGetCharInfo({ cc_idx: 21 });
  const chartRef = useRef(null);
  const chartBlueRef = useRef([]);
  const [chartHour, setChartHour] = useState(12);

  // ✅ 차트가 생성될 때 `chartRef`를 최신 상태로 유지
  const chartCallback = (chart) => {
    if (chart && chart !== chartRef.current) {
      chartRef.current = chart;
    }
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const chart = chartRef.current;
    const now = new Date(data.timecode_datetime).getTime();

    // 1. 현재 빨간색 시리즈 찾기
    const redSeries = Object.values(chart.series)
      .filter((s) => s.color?.startsWith("rgba(255, 0, 0"))
      .sort((a, b) => (a.data[0]?.x || 0) - (b.data[0]?.x || 0));

    // 2. 녹색 시리즈 업데이트
    const greenSeries = chart.get("series1");
    if (greenSeries) {
      const chartAddTime = data.week_price_chart
        .map((item, index) => {
          const ago = (data.week_price_chart.length - 1 - index) * 1;
          const timestamp = now - ago * ONE_HOUR;
          return [timestamp, item];
        })
        .filter((_, index) => index >= 144 - Number(chartHour));

      greenSeries.update({ data: chartAddTime }, true);
    }

    // 3. 파란색 시리즈 찾기
    const blueSeries = chart.get("series2");

    // 4. 첫 번째 빨간색 데이터를 파란색 시리즈로 이동
    if (redSeries.length) {
      const newBluePoints = redSeries
        .map((series) => {
          if (series.data.length) {
            return [series.data[0].x, series.data[0].y];
          }
          return null;
        })
        .filter((point) => point !== null);

      const futureTime = now + 1 * (ONE_HOUR * 6);

      if (newBluePoints[newBluePoints.length - 1][0] !== futureTime) {
        console.log(chartBlueRef.current, " + ", newBluePoints, " = ", [
          ...chartBlueRef.current,
          ...newBluePoints,
        ]);

        chartBlueRef.current = [...chartBlueRef.current, ...newBluePoints];

        blueSeries.update(
          {
            data: chartBlueRef.current.filter(
              (_, index) =>
                index >=
                chartBlueRef.current.length - 36 - Number(chartHour * 6)
            ),
          },
          true
        );
      }
      // 빨간색 시리즈 제거
      redSeries.forEach((series) => series.remove(false));
    }

    // 5. 새로운 빨간색 시리즈 추가
    data.ai_price_chart.forEach((prediction, index) => {
      const opacity = 1 - index * 0.15;
      const futureTime = now + (index + 1) * ONE_HOUR;

      chart.addSeries(
        {
          name: `${index + 1}시간 뒤`,
          data: [[futureTime, prediction]],
          type: "line",
          color: `rgba(255, 0, 0, ${opacity})`,
          marker: { symbol: "circle", radius: 5 },
        },
        true
      );
    });
  }, [data, isSuccess, chartHour]);

  const baseOptions = {
    chart: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      type: "areaspline",
      height: 600,
      spacingRight: 0,
      spacingLeft: 0,
      style: { fontSize: "13px", marginTop: "9px" },
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

        if (points) {
          return formatHtml.map((html, idx) => {
            if (html === "") return "";
            if (idx === 0)
              return `<span style="font-size: 10px;">${format(
                x,
                "yyyy-MM-dd HH:mm"
              )}</span><br/>`;

            const point = points.find((p) => html.includes(p.color));

            return `<span style="color:${point.color}">●</span>
                  <span style="font-size: 10px;"> 
                    coinName : symbol ${numberWithCommas(point.y)}
                  </span><br/>`;
          });
        } else {
          return formatHtml.map((html, idx) => {
            const { x, point } = this;

            if (html === "") return "1111";
            if (idx === 0) {
              return `<span style="font-size: 10px;">${format(
                x,
                "yyyy-MM-dd HH:mm"
              )}</span><br/>`;
            }
            return `<span style="color:${point.color}">●</span>
                  <span style="font-size: 10px;"> 
                    coinName : symbol ${numberWithCommas(point.y)}
                  </span><br/>`;
          });
        }
      },
    },
    series: [
      {
        name: "Current Price",
        data: [],
        id: "series1",
        type: "line",
        color: "#45B341",
        marker: { enabled: false },
      },
      {
        name: "Prediction History",
        data: [],
        id: "series2",
        type: "line",
        lineWidth: 0,
        color: "#007EC8",
        marker: {
          symbol: "circle",
          radius: 5,
          enabled: true, // 항상 마커 표시
          enabledThreshold: 0, // 데이터 개수와 관계없이 마커 표시
        },
        states: {
          hover: {
            lineWidthPlus: 0, // 호버 시 선 두께 증가 방지
          },
        },
      },
    ],
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2>MultiTimeSeriesLogChart</h2>
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
      <HighchartsReact
        highcharts={Highcharts}
        options={baseOptions}
        callback={chartCallback} // 최신 chartRef 유지
        allowChartUpdate={false} // 불필요한 전체 차트 업데이트 방지
        updateArgs={[true, true, { duration: 500 }]} // 데이터 변경 시 애니메이션 적용
      />
    </div>
  );
}

export default MultiTimeSeriesLogChart;
