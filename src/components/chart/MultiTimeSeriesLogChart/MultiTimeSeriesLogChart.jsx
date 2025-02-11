import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    height: 400,
  },
  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: "°C",
  },
  series: [
    {
      name: "Temperature",
      data: [1, 2, 3],
      zIndex: 1,
      marker: {
        fillColor: "white",
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[0],
      },
    },
    // {
    //   name: "Range",
    //   data: [1, 2, 3],
    //   type: "arearange",
    //   lineWidth: 0,
    //   linkedTo: ":previous",
    //   color: Highcharts.getOptions().colors[0],
    //   fillOpacity: 0.3,
    //   zIndex: 0,
    //   marker: {
    //     enabled: false,
    //   },
    // },
  ],
};

function MultiTimeSeriesLogChart() {
  return (
    <div>
      <h2>MultiTimeSeriesLogChart</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default MultiTimeSeriesLogChart;
