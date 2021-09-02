type = ['primary', 'info', 'success', 'warning', 'danger'];
var GraphPoints = 50;
var chart_labels = [];
var chart_data = [];
var myChartData;
var myVGuage;
var gaugePS;

var totalCells = 120;
var greenBtyStartRange = 3.0;



demo = {
  initPickColor: function () {
    console.log("Function 1");
    $('.pick-class-label').click(function () {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },



  initMyFunc: function () {

    console.log("Im in Function Init");


    if (document.getElementById("chartBig1")) {
      for (var i = 0; i < GraphPoints; i++) {
        chart_labels.push((i + 1).toString());
        chart_data.push(0);
      }
      myChartData.update();
    }

  },


  UpdateData: function (dataFirebase) {

    //console.log("FireBase Data Recieved");


    var myVar = document.getElementById('lastUpdatedTime2');
    myVar.innerText = dataFirebase.child('lastUpdatedTime').val();

    
    for (var i = 0; i < totalCells; i++) {
      var valueCell = dataFirebase.child('v_array').child(i).val();

      //console.log(i+ " -> " +valueCell);
      if (document.getElementById('cell_' + (i + 1) + 'volts')) {
        var elementCell = document.getElementById('cell_' + (i + 1) + 'volts');
        var elementImage = document.getElementById('cell_' + (i + 1) + 'img');
        elementCell.innerText = valueCell + ' V';
        if (valueCell > greenBtyStartRange) {
          elementImage.src = "../assets/img/battery.png";
        } else {
          elementImage.src = "../assets/img/batteryRed.png";
        }
      } else {
        //console.log('item not found ->  cell_' + (i + 1) + 'volts');
      }
    }



    // PackVoltage extract 
    if (document.getElementById("chartBig1")) {
      var valuePack = dataFirebase.child('batt_array').child(0).val();
      chart_data.shift();
      chart_data.push(valuePack);
      myChartData.update();
    }

	var VoltagePercent = (valuePack * 100) / 12.6;

    // Guage value

    if (document.getElementById("firstGuage")) {
      var firstGuage = document.getElementById("firstGuage");
      firstGuage.setAttribute("data-value", valuePack);
    }
    if (document.getElementById("firstGuage")) {
      var secondGuage = document.getElementById("secondGuage");
      //secondGuage.setAttribute("data-value", dataFirebase.child('packCurrent').val());
	  secondGuage.setAttribute("data-value", VoltagePercent);
    }

    if (document.getElementById("firstGuage")) {
      var thirdGuage = document.getElementById("thirdGuage");
      thirdGuage.setAttribute("data-value", dataFirebase.child('TMR1').val());
    }

  },


  initFirebase: function () {

    var firebaseConfig = {
      apiKey: "AIzaSyCFLWJiKrlMJIB2_TJWVoV4M2QIXWtUeqk",
      authDomain: "bmss-48ed4.firebaseapp.com",
      databaseURL: "https://bmss-48ed4-default-rtdb.firebaseio.com/",
      projectId: "bmss-48ed4",
      storageBucket: "bmss-48ed4.appspot.com",
      messagingSenderId: "878524069250",
      appId: "1:878524069250:web:c81d783fcaefe6be1e8b9b",
      measurementId: "G-PY2EJ55G2P"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var dbRef = firebase.database().ref().child('BMS_BQ76920');
    dbRef.on('value', function (snapshot) {
      console.log("Firebase data recieved");
      demo.UpdateData(snapshot)
    });

  },


  initGuages: function () {
    gaugePS = new RadialGauge({
      renderTo: 'gauge-ps',
      width: 400,
      height: 400,
      units: 'PS',
      minValue: 0,
      maxValue: 1000,
      majorTicks: [
        '0',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        '1000'
      ],
      minorTicks: 2,
      ticksAngle: 270,
      startAngle: 45,
      strokeTicks: true,
      highlights: [
        { from: 457, to: 880, color: 'rgba(78,   78, 76, 0.5)' },
        { from: 880, to: 1000, color: 'rgba(225, 7, 23, 0.75)' }
      ],
      valueInt: 1,
      valueDec: 0,
      colorPlate: "#fff",
      colorMajorTicks: "#686868",
      colorMinorTicks: "#686868",
      colorTitle: "#000",
      colorUnits: "#000",
      colorNumbers: "#686868",
      valueBox: true,
      colorValueText: "#000",
      colorValueBoxRect: "#fff",
      colorValueBoxRectEnd: "#fff",
      colorValueBoxBackground: "#fff",
      colorValueBoxShadow: false,
      colorValueTextShadow: false,
      colorNeedleShadowUp: true,
      colorNeedleShadowDown: false,
      colorNeedle: "rgba(200, 50, 50, .75)",
      colorNeedleEnd: "rgba(200, 50, 50, .75)",
      colorNeedleCircleOuter: "rgba(200, 200, 200, 1)",
      colorNeedleCircleOuterEnd: "rgba(200, 200, 200, 1)",
      borderShadowWidth: 0,
      borders: true,
      borderInnerWidth: 0,
      borderMiddleWidth: 0,
      borderOuterWidth: 5,
      colorBorderOuter: "#fafafa",
      colorBorderOuterEnd: "#cdcdcd",
      needleType: "arrow",
      needleWidth: 2,
      needleCircleSize: 7,
      needleCircleOuter: true,
      needleCircleInner: false,
      animationDuration: 1500,
      animationRule: "dequint",
      fontNumbers: "Verdana",
      fontTitle: "Verdana",
      fontUnits: "Verdana",
      fontValue: "Led",
      fontValueStyle: 'italic',
      fontNumbersSize: 20,
      fontNumbersStyle: 'italic',
      fontNumbersWeight: 'bold',
      fontTitleSize: 24,
      fontUnitsSize: 22,
      fontValueSize: 50,
      animatedValue: true
    });

    gaugePS.draw();
    gaugePS.value = "510";

  },


  initDocChart: function () {
    chartColor = "#FFFFFF";
    console.log("Function 2");

    // General configuration for the charts with Line gradientStroke
    gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    ctx = document.getElementById('lineChartExample').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Active Users",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630]
        }]
      },
      options: gradientChartOptionsConfiguration
    });
  },

  initDashboardPageCharts: function () {


    /*
    
        gradientChartOptionsConfigurationWithTooltipBlue = {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
    
          tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          responsive: true,
          scales: {
            yAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 60,
                suggestedMax: 125,
                padding: 20,
                fontColor: "#2380f7"
              }
            }],
    
            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#2380f7"
              }
            }]
          }
        };
    
        
    
        gradientChartOptionsConfigurationWithTooltipOrange = {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
    
          tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          responsive: true,
          scales: {
            yAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 110,
                padding: 20,
                fontColor: "#ff8a76"
              }
            }],
    
            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(220,53,69,0.1)',
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#ff8a76"
              }
            }]
          }
        };
    
        gradientChartOptionsConfigurationWithTooltipGreen = {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
    
          tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          responsive: true,
          scales: {
            yAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 125,
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }],
    
            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(0,242,195,0.1)',
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }]
          }
        };
    
    
        gradientBarChartConfiguration = {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
    
          tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          responsive: true,
          scales: {
            yAxes: [{
    
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 60,
                suggestedMax: 120,
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }],
    
            xAxes: [{
    
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }]
          }
        };
    
       
    
        var myChart = new Chart(ctx, {
          type: 'line',
          data: data,
          options: gradientChartOptionsConfigurationWithTooltipPurple
        });
    
    
        var ctxGreen = document.getElementById("chartLineGreen").getContext("2d");
    
        var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
        gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
        gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors
    
        var data = {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
          datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#00d6b4',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00d6b4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#00d6b4',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [90, 27, 60, 12, 80],
          }]
        };
    
        var myChart = new Chart(ctxGreen, {
          type: 'line',
          data: data,
          options: gradientChartOptionsConfigurationWithTooltipGreen
    
        });
    
    
      */


    gradientChartOptionsConfigurationWithTooltipPurple = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 20,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var ctx = document.getElementById("chartBig1").getContext('2d');
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var myoptions = {
      scales: {
        scaleStartValue: 0,
        yAxes: [{
          display: true,
          ticks:
          {
            //min: 0,
            //beginAtZero: true,   // minimum value will be 0.
            //scaleBeginAtZero: true,
            //min: 0,
            //max: 50,
            //stepSize: 5 // 1 - 2 - 3 ...
          }
        }]
      }
    };

    var config = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: [{
          label: "Voltage",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#d346b1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#d346b1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#d346b1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          //scaleOverride : true,
          //scaleSteps : 10,
          //scaleStepWidth : 50,
          //scaleStartValue : 0 
          data: chart_data,
        }]
      },

      options: gradientChartOptionsConfigurationWithTooltipPurple,   //myoptions,    //gradientChartOptionsConfigurationWithTooltipPurple,
    };

    myChartData = new Chart(ctx, config);
    $("#0").click(function () {
      var data = myChartData.config.data;
      data.datasets[0].data = chart_data;
      data.labels = chart_labels;

      myChartData.update();
    });
    $("#1").click(function () {
      var chart_data = [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120];
      var data = myChartData.config.data;
      data.datasets[0].data = chart_data;
      data.labels = chart_labels;
      myChartData.update();
    });

    $("#2").click(function () {
      var chart_data = [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130];
      var data = myChartData.config.data;
      data.datasets[0].data = chart_data;
      data.labels = chart_labels;
      myChartData.update();
    });


    var ctx = document.getElementById("CountryChart").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


    var myChart = new Chart(ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
        datasets: [{
          label: "Countries",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        }]
      },
      options: gradientBarChartConfiguration
    });

  },

  initGoogleMaps: function () {
    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#8ec3b9"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1a3646"
        }]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#64779e"
        }]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#334e87"
        }]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#283d6a"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#6f9ba5"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#3C7680"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#304a7d"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#98a5be"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#2c6675"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#9d2a80"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#9d2a80"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#b0d5ce"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#98a5be"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#283d6a"
        }]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
          "color": "#3a4762"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#0e1626"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#4e6d70"
        }]
      }
      ]
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  },

  showNotification: function (from, align) {
    color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "tim-icons icon-bell-55",
      message: "Welcome to <b>Black Dashboard</b> - a beautiful freebie for every web developer."

    }, {
      type: type[color],
      timer: 8000,
      placement: {
        from: from,
        align: align
      }
    });
  }

};