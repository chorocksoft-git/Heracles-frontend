import { HOUR, TEN_MINUTES, tickInterval } from "../constants/charDate";

export const createChartData = ({
  week_price_chart: weekPriceChart,
  ai_price_chart: aiPriceChart,
  timecode_datetime: timecodeDatetime,
  is_same_timecode: isSameTimecode,
  period = "1D",
}) => {
  const timeCode = timecodeDatetime?.split(" ").join("T");

  const now = new Date(timeCode);

  const baseTime = new Date(timeCode).setHours(
    period === HOUR
      ? now.getHours() - 24
      : now.getHours() - weekPriceChart.length + 1
  );

  const calcWeepPrice =
    period === HOUR ? weekPriceChart.slice(145, 169) : weekPriceChart;

  const calcAiPrice =
    period === HOUR
      ? aiPriceChart.slice(145, 169)
      : aiPriceChart.slice(0, aiPriceChart.length - 1);

  const lastAiPricePoint = aiPriceChart[aiPriceChart.length - 1];

  return {
    is_same_timecode: isSameTimecode,
    last_ai_price_point: [
      period === HOUR
        ? (parseInt(baseTime / tickInterval, 10) + (24 + 1)) * tickInterval +
          parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
        : (parseInt(baseTime / tickInterval, 10) + 169) * tickInterval +
          parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES,
      lastAiPricePoint,
    ],
    week_price_chart: calcWeepPrice.map((price, idx) => {
      // 기본 시간 계산
      let time =
        period === HOUR
          ? (parseInt(baseTime / tickInterval, 10) + (idx + 1)) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
          : (parseInt(baseTime / tickInterval, 10) + idx) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES;

      return [time, price];
    }),

    ai_price_chart: calcAiPrice.map((price, idx) => {
      // 기본 시간 계산
      let time =
        period === HOUR
          ? (parseInt(baseTime / tickInterval, 10) + (idx + 1)) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
          : (parseInt(baseTime / tickInterval, 10) + idx) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES;

      return [time, price];
    }),
  };
};
