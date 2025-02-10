import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "areaspline",
    height: 400,
  },
  title: {
    text: "My stock chart",
  },
  series: [
    {
      data: [1, 2, 3],
    },
  ],
};

function TimeSeriesLogChart() {
  return (
    <div>
      <h2>TimeSeriesLogChart</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default TimeSeriesLogChart;
