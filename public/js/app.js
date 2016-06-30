$(document).ready(function() {
  // Navigation
  $(".list-nav").hover(function() {
    $(this).css("text-decoration", "underline");
    $(this).css("color", "#DF5353");
  }, function(){
    $(this).css("text-decoration", "none");
    $(this).css("color", "black");
  });
// AJAX call for benchmark/hospital data
// $("#dataset").click(function() {
  $.ajax({
    method: "GET",
    url: "/dashboard/q-dataset"
  }).done(function(data) {
    console.log("DATA", data.readmissionObjAll.benchmark);
    console.log("DATA2", data.ratioObjAll.benchmark);

    /////////////////// HIGHCHARTS //////////////////

    // Chart-container-1 - Percent Readmissions //
      var chartDataBenchmarkP = data.readmissionObjAll.benchmark;
      var chartDataHospitalP = data.readmissionObjAll.hospital;
      var chartOptionsP = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Readmissions Percentage'
        },
        subtitle: {
            text: '% of readmissions out of total discharges'
        },
        xAxis: {
            categories: [
                'COPD',
                'Hip/Knee Surgery',
                'Heart Attack (AMI)',
                'Heart Failure',
                'Pneumonia'
            ]
        },
        yAxis: [{
            min: 0,
            title: {
                text: '%  Readmissions'
            }
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Benchmark',
            color: 'rgba(165,170,217,1)',
            data: chartDataBenchmarkP,
            pointPadding: 0.3,
            pointPlacement: 0
        }, {
            name: 'Hospital',
            color: 'rgba(126,86,134,.9)',
            data: chartDataHospitalP,
            pointPadding: 0.4,
            pointPlacement: 0
        }]
      };

    $('#chart-container-1').highcharts(chartOptionsP);

    //// 5 Ratio Charts ////

    // Chart-container-2 COPD //
    var chartDataBenchmarkCOPDbottom = parseFloat(data.ratioObjAll.benchmark[0][0]);
    var chartDataBenchmarkCOPDtop = parseFloat(data.ratioObjAll.benchmark[0][1]);
    var chartDataHospitalCOPD = parseFloat(data.ratioObjAll.hospital[0]);
    var chartOptionsCOPD = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'COPD'
          },
          subtitle: {
              text: 'Compare your hospital to the TOP and BOTTOM excess ratios in your Benchmark'
          },
          xAxis: {
              categories: [
                  'COPD'
              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Excess Ratio Range'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.1,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Top',
              data: [chartDataBenchmarkCOPDtop],
              color: "#7cb5ec"
          }, {
              name: 'Bottom',
              data: [chartDataBenchmarkCOPDbottom],
              color: "#7798BF"
          }, {
              name: 'Hospital',
              data: [chartDataHospitalCOPD],
              color: "rgba(126,86,134,.9)"
          }]
      };

    $('#chart-container-2').highcharts(chartOptionsCOPD);

    // Chart-container-3 HIP/KNEE //
    var chartDataBenchmarkHKbottom = parseFloat(data.ratioObjAll.benchmark[1][0]);
    var chartDataBenchmarkHKtop = parseFloat(data.ratioObjAll.benchmark[1][1]);
    var chartDataHospitalHK = parseFloat(data.ratioObjAll.hospital[1]);
    var chartOptionsHK = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'HIP/KNEE'
          },
          subtitle: {
              text: 'Compare your hospital to the TOP and BOTTOM excess ratios in your Benchmark'
          },
          xAxis: {
              categories: [
                  'HIP/Knee'
              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Excess Ratio Range'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.1,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Top',
              data: [chartDataBenchmarkHKtop],
              color: "#7cb5ec"

          }, {
              name: 'Bottom',
              data: [chartDataBenchmarkHKbottom],
              color: "#7798BF"
          }, {
              name: 'Hospital',
              data: [chartDataHospitalHK],
              color: "rgba(126,86,134,.9)"
          }]
      };

    $('#chart-container-3').highcharts(chartOptionsHK);

    // Chart-container-4 Heart Failure (AMI) //
    var chartDataBenchmarkAMIbottom = parseFloat(data.ratioObjAll.benchmark[2][0]);
    var chartDataBenchmarkAMItop = parseFloat(data.ratioObjAll.benchmark[2][1]);
    var chartDataHospitalAMI = parseFloat(data.ratioObjAll.hospital[2]);
    var chartOptionsAMI = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Heart Attach (AMI)'
          },
          subtitle: {
              text: 'Compare your hospital to the TOP and BOTTOM excess ratios in your Benchmark'
          },
          xAxis: {
              categories: [
                  'AMI'
              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Excess Ratio Range'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.1,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Top',
              data: [chartDataBenchmarkAMItop],
              color: "#7cb5ec"

          }, {
              name: 'Bottom',
              data: [chartDataBenchmarkAMIbottom],
              color: "#7798BF"
          }, {
              name: 'Hospital',
              data: [chartDataHospitalAMI],
              color: "rgba(126,86,134,.9)"
          }]
      };

    $('#chart-container-4').highcharts(chartOptionsAMI);

    // Chart-container-5 Heart Failure //
    var chartDataBenchmarkHFbottom = parseFloat(data.ratioObjAll.benchmark[3][0]);
    var chartDataBenchmarkHFtop = parseFloat(data.ratioObjAll.benchmark[3][1]);
    var chartDataHospitalHF = parseFloat(data.ratioObjAll.hospital[3]);
    var chartOptionsHF = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Heart Failure'
          },
          subtitle: {
              text: 'Compare your hospital to the TOP and BOTTOM excess ratios in your Benchmark'
          },
          xAxis: {
              categories: [
                  'Heart Failure'

              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Excess Ratio Range'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.1,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Top',
              data: [chartDataBenchmarkHFtop],
              color: "#7cb5ec"

          }, {
              name: 'Bottom',
              data: [chartDataBenchmarkHFbottom],
              color: "#7798BF"
          }, {
              name: 'Hospital',
              data: [chartDataHospitalHF],
              color: "rgba(126,86,134,.9)"
          }]
      };

    $('#chart-container-5').highcharts(chartOptionsHF)

        // Chart-container-3 HIP/KNEE //
    var chartDataBenchmarkPNbottom = parseFloat(data.ratioObjAll.benchmark[4][0]);
    var chartDataBenchmarkPNtop = parseFloat(data.ratioObjAll.benchmark[4][1]);
    var chartDataHospitalPN = parseFloat(data.ratioObjAll.hospital[4]);
    var chartOptionsPN = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Pneumonia'
          },
          subtitle: {
              text: 'Compare your hospital to the TOP and BOTTOM excess ratios in your Benchmark'
          },
          xAxis: {
              categories: [
                  'Pneumonia'

              ],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Excess Ratio Range'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.1,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Top',
              data: [chartDataBenchmarkPNtop],
              color: "#7cb5ec"

          }, {
              name: 'Bottom',
              data: [chartDataBenchmarkPNbottom],
              color: "#7798BF"
          }, {
              name: 'Hospital',
              data: [chartDataHospitalPN],
              color: "rgba(126,86,134,.9)"
          }]
      };

    $('#chart-container-6').highcharts(chartOptionsPN);
  }); // End Ajax
// }); // End onClick


$("#runReport").click(function() {
  $.get("https://data.medicare.gov/resource/kac9-a9fp.json")
  .done(function(data) {

  })
})
  // Highchart example
$(function () {
  var chartData = [1, 0, 4];
  var chartOptions = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    series: [{
        name: 'Jane',
        data: chartData
    }]
  };

  $('#chart-container').highcharts(chartOptions);
});

$(function () {
 // var chartData =
})


/**
 * Grid-light theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: "Dosis, sans-serif"
      }
   },
   title: {
      style: {
         fontSize: '18px',
         fontWeight: 'bold',
         textTransform: 'uppercase'
      }
   },
   tooltip: {
      borderWidth: 0,
      backgroundColor: 'rgba(219,219,216,0.8)',
      shadow: false
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '14px'
      }
   },
   xAxis: {
      gridLineWidth: 1,
      labels: {
         style: {
            fontSize: '12px'
         }
      }
   },
   yAxis: {
      minorTickInterval: 'auto',
      title: {
         style: {
            textTransform: 'uppercase'
         }
      },
      labels: {
         style: {
            fontSize: '14px'
         }
      }
   },
   plotOptions: {
      candlestick: {
         lineColor: '#404048'
      }
   },


   // General
   background2: '#F0F0EA'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

}); // End doc ready
