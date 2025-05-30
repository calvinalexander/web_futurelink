import React from "react";
import ReactApexChart from "react-apexcharts";

function getChartColorsArray(colors) {
  colors = JSON.parse(colors);
  return colors.map(function (value) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
          var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
          if (color.indexOf("#") !== -1)
              color = color.replace(" ", "");
          if (color) return color;
          else return newValue;
      } else {
          var val = value.split(',');
          if (val.length === 2) {
              var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
              rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
              return rgbaColor;
          } else {
              return newValue;
          }
      }
  });
}

const Basic = ({dataColors}) => {
  var chartBoxBasicColors = getChartColorsArray(dataColors);
    const series = [
        {
            type: "boxPlot",
            data: [
                {
                    x: "Jan 2015",
                    y: [54, 66, 69, 75, 88],
                },
                {
                    x: "Jan 2016",
                    y: [43, 65, 69, 76, 81],
                },
                {
                    x: "Jan 2017",
                    y: [31, 39, 45, 51, 59],
                },
                {
                    x: "Jan 2018",
                    y: [39, 46, 55, 65, 71],
                },
                {
                    x: "Jan 2019",
                    y: [29, 31, 35, 39, 44],
                },
                {
                    x: "Jan 2020",
                    y: [41, 49, 58, 61, 67],
                },
                {
                    x: "Jan 2021",
                    y: [54, 59, 66, 71, 88],
                },
            ],
        },
    ];
    var options = {
      chart: {
        type: 'boxPlot',
        height: 350,
        toolbar: {
            show: false
        }
    },
    title: {
        text: 'Basic BoxPlot Chart',
        align: 'left',
        style: {
            fontWeight: 500,
        },
    },
    plotOptions: {
        boxPlot: {
            colors: {
                upper: chartBoxBasicColors[0],
                lower: chartBoxBasicColors[1]
                },
            },
        },
    };

    return (
        <React.Fragment>
            <ReactApexChart
                options={options}
                series={series}
                type="boxPlot"
                height={350}
            />
        </React.Fragment>
    );
};

const Scatter = ({dataColors}) => {
  var chartBoxBasicColors = getChartColorsArray(dataColors);
    const series = [
      {
        name: "Box",
        type: "boxPlot",
        data: [
          {
            x: new Date("2017-01-01").getTime(),
            y: [54, 66, 69, 75, 88]
          },
          {
            x: new Date("2018-01-01").getTime(),
            y: [43, 65, 69, 76, 81]
          },
          {
            x: new Date("2019-01-01").getTime(),
            y: [31, 39, 45, 51, 59]
          },
          {
            x: new Date("2020-01-01").getTime(),
            y: [39, 46, 55, 65, 71]
          },
          {
            x: new Date("2021-01-01").getTime(),
            y: [29, 31, 35, 39, 44]
          }
        ]
      },
      {
        name: "Outliers",
        type: "scatter",
        data: [
          {
            x: new Date("2017-01-01").getTime(),
            y: 32
          },
          {
            x: new Date("2018-01-01").getTime(),
            y: 25
          },
          {
            x: new Date("2019-01-01").getTime(),
            y: 64
          },
          {
            x: new Date("2020-01-01").getTime(),
            y: 27
          },
          {
            x: new Date("2020-01-01").getTime(),
            y: 78
          },
          {
            x: new Date("2021-01-01").getTime(),
            y: 15
          }
        ]
      }
    ];
    var options = {
      chart: {
        toolbar: {
          show: !1
        }
      },
      colors: chartBoxBasicColors,
      title: {
        text: "BoxPlot - Scatter Chart",
        align: "left",
        style: {
          fontWeight: 500,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          formatter: function (val) {
            return new Date(val).getFullYear();
          }
        }
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: chartBoxBasicColors[2],
            lower: chartBoxBasicColors[3]
          }
        }
      },
      tooltip: {
        shared: !1,
        intersect: !0
      }
    };
  
    return (
      <React.Fragment>
        <ReactApexChart
          options={options}
          series={series}
          type="boxPlot"
          height={350}
        />
      </React.Fragment>
    );
  };

export {
    Basic,
    Scatter
};
