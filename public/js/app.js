  // Highchart defined globally
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

$(document).ready(function() {

  $(".list-nav").hover(function() {
    $(this).css("text-decoration", "underline");
    $(this).css("color", "purple");
  }, function(){
    $(this).css("text-decoration", "none");
    $(this).css("color", "black");
  });



}); // end doc ready
