$(document).ready(function() {
// AJAX call for benchmark/hospital data
$.ajax({
  method: "GET",
  url: "/dashboard/q-dataset"
}).done(function(data) {
  // alert(data.readmissionObjAll.benchmark[0])
  console.log("DATA", data.readmissionObjAll.benchmark);

  $(function () {
    var chartDataBenchmark = data.readmissionObjAll.benchmark;
    var chartDataHospital = data.readmissionObjAll.hospital;
    var chartOptions = {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Percent Readmissions out of Discharges'
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
              text: 'Measures'
          }
      }],
      legend: {
          shadow: false
      },
      tooltip: {
          shared: true
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
          data: chartDataBenchmark,
          pointPadding: 0.3,
          pointPlacement: 0
      }, {
          name: 'Hospital',
          color: 'rgba(126,86,134,.9)',
          data: chartDataHospital,
          pointPadding: 0.4,
          pointPlacement: 0
      }]
    };

  $('#chart-container-1').highcharts(chartOpions);
  }); // End Chart 1

}); // End Ajax


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

  $(".list-nav").hover(function() {
    $(this).css("text-decoration", "underline");
    $(this).css("color", "purple");
  }, function(){
    $(this).css("text-decoration", "none");
    $(this).css("color", "black");
  });



}); // end doc ready
