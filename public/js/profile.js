let currentApiary = "";
let currentHive = "";
let TIntChart, HIntChart, FChart, SChart;

$(document).ready(() => {
  console.log(dataApiaries);
  $('.User-avatar').click(function () {
    if ($('.User-Dropdown').hasClass('U-open')) {
      $('.User-Dropdown').removeClass('U-open');
    } else {
      $('.User-Dropdown').addClass('U-open');
    }
  });

  $('#new-apiary-rb').change(() => {
    $('#new-apiary-name').removeClass('invisible');
    $('#dropdown-existing-apiary').addClass('invisible');
  });

  $('#existing-apiary-rb').change(() => {
    $('#new-apiary-name').addClass('invisible');
    $('#dropdown-existing-apiary').removeClass('invisible');
  });

  $('#add-apiario-btn').on('click', () => {
    $('.modal').modal({
      blurring: true
    }).modal('show');
    $('#new-apiary-rb').prop("checked", true);
    $('#new-apiary-name').removeClass('invisible');
    $('#dropdown-existing-apiary').addClass('invisible');
    $('input[type="file"]').val(null);
    $('input[type="file"]+label').addClass('yellow');
    $('input[type="file"]+label').removeClass('green');
    $('input[type="file"]+label').html('<i class="ui upload icon"></i>Subir archivo');
  });

  $('#cancelar-subida').on('click', () => {
    $('.modal').modal('hide');
  });

  $('input[type="file"]').change((e) => {
    let fileName = $(e.target).val();
    fileName = fileName.slice(fileName.lastIndexOf('\\') + 1);
    if (fileName) {
      $('input[type="file"]+label').removeClass('yellow');
      $('input[type="file"]+label').addClass('green');
      $('input[type="file"]+label').html("Archivo: " + fileName);
    }
  });

  $('.sidebar-item').click((e) => {
    $('.ui.sidebar').sidebar('hide');
    cleanChartContainer();
    currentApiary = $($(e.target).parent().children()[0]).text();
    currentHive = $(e.target).text();
    console.log(currentApiary + " - " + currentHive);
    $("#selected-hive").text("Colmena " + currentHive + " del apiario " + currentApiary);
    innerTempChart();
  });

  $('.ui.sidebar')
    .sidebar({
      context: $('main'), //Element that contains the nav and the content
      //onChange: () => console.log()      
    })
    .sidebar('attach events', '#open-sidebar'); //Trigger element

  $('.ui.top.secondary.pointing.menu>.item').click((e) => {
    $('.ui.top.secondary.pointing.menu>.item.active').removeClass("active");
    $(e.target).addClass("active");
    switch ($(e.target).html()) {
      case "Temperatura Interna":
        innerTempChart();
        break;
      case "Humedad Interna":
        innerHumChart();
        break;
      case "Niveles de Humo":
        fumesChart();
        break;
      case "Seguridad":
        sequrityChart();
        break;
      default:
        break;
    }
  });

  $("form").on("submit", function (event) {
    event.preventDefault();

    let fileName = $('input[type="file"]').val();
    fileName = fileName.slice(fileName.lastIndexOf('\\') + 1);
    if (!fileName) {
      alert("Debes seleccionar un archivo para subir");
      return;
    }

    let data = {};
    data.file = document.getElementById('embedpollfileinput').files[0];
    let whereToSave = $(this).serialize();
    //TODO: do not allow user to create an apiary with the exact same name of an existing one.
    if (whereToSave.includes("new")) {
      data["where-to-save"] = "new-apiary";
      data["apiary-name"] = $('input[type="text"]').val();
      if (!data["apiary-name"]) {
        alert("Debes ingresar un nombre para el nuevo apiario");
        return;
      }
    } else if (whereToSave.includes("existing")) {
      data["where-to-save"] = "existing-apiary";
      data["apiary-name"] = $('.dropdown').dropdown('get value');
      if (data["apiary-name"].includes("Seleccione el apiario")) {
        alert("Debes seleccionar un apiario");
        return;
      }
    }
    let FD = new FormData();
    for (let name in data) {
      FD.append(name, data[name]);
    }

    fetch("/profile", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: 'follow',
        body: FD
      })
      .then(response => {
        if (response.redirected) window.location = response.url;
      });
  });
});

const cleanChartContainer = () => {
  if (TIntChart instanceof ApexCharts) {
    TIntChart.destroy();
    TIntChart = null;
  } else if (HIntChart instanceof ApexCharts) {
    HIntChart.destroy();
    HIntChart = null;
  } else if (FChart instanceof ApexCharts) {
    FChart.destroy();
    FChart = null;
  } else if (SChart instanceof ApexCharts) {
    SChart.destroy();
    SChart = null;
  }
};

const innerTempChart = () => {
  console.log("innerTempChart");
  if (currentApiary.length < 1) return;
  let graphData = dataApiaries.find(apiariy => apiariy.apiaryName == currentApiary)
    .hives.find(hive => hive.id == currentHive);
  graphData = graphData.data.map(d => ({
    time: new Date(d.time),
    temperature: d.innerTemperature
  }));
  seriesData = graphData.map(d => d.temperature);
  cleanChartContainer();
  let options = {
    chart: {
      type: 'line',
      shadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1
      },
      height: 500,
      width: '99%',
      zoom: {
        type: 'x',
        enabled: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      name: 'Temperatura Interna',
      data: seriesData
    }],
    yaxis: {
      min: Math.min.apply(null, seriesData) - 10,
      max: Math.max.apply(null, seriesData) + 10
    },
    xaxis: {
      categories: graphData.map(d => d.time.toGMTString()),
      type: 'datetime',
    },

    tooltip: {
      shared: false,
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      style: 'inverted',
      size: 6
    }
  };

  TIntChart = new ApexCharts(document.querySelector("#chart"), options);
  TIntChart.render();
};
const innerHumChart = () => {
  console.log("innerHumChart");
  if (currentApiary.length < 1) return;
  let graphData = dataApiaries.find(apiariy => apiariy.apiaryName == currentApiary)
    .hives.find(hive => hive.id == currentHive);
  graphData = graphData.data.map(d => ({
    time: new Date(d.time),
    humidity: d.innerHumidity
  }));
  seriesData = graphData.map(d => d.humidity);
  cleanChartContainer();
  let options = {
    chart: {
      type: 'line',
      shadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1
      },
      height: 500,
      width: '99%',
      zoom: {
        type: 'x',
        enabled: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      name: 'Humedad Interna',
      data: seriesData
    }],
    yaxis: {
      min: Math.min.apply(null, seriesData) - 10,
      max: Math.max.apply(null, seriesData) + 10
    },
    xaxis: {
      categories: graphData.map(d => d.time.toGMTString()),
      type: 'datetime',
    },

    tooltip: {
      shared: false,
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      style: 'inverted',
      size: 6
    }
  };

  HIntChart = new ApexCharts(document.querySelector("#chart"), options);
  HIntChart.render();
};
const fumesChart = () => {
  console.log("fumesChart");

  if (currentApiary.length < 1) return;
  let graphData = dataApiaries.find(apiariy => apiariy.apiaryName == currentApiary)
    .hives.find(hive => hive.id == currentHive);
  graphData = graphData.data.map(d => ({
    time: new Date(d.time),
    fumes: d.fumes
  }));
  seriesData = graphData.map(d => d.fumes);

  cleanChartContainer();
  let options = {
    chart: {
      type: 'bar',
      stacked: false,
      height: 500,
      width: "99%",
      zoom: {
        type: 'x',
        enabled: true
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: 'zoom'
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2
    },
    series: [{
      name: 'Nivel de humo',
      data: seriesData
    }],
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: graphData.map(d => d.time.toGMTString()),
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Nivel de humo',
        style: {
          color: undefined,
          fontSize: '20px',
        },
      },
      min: Math.min.apply(null, seriesData) - 10,
      max: Math.max.apply(null, seriesData) + 10,
      tickAmount: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    },
  };
  FChart = new ApexCharts(document.querySelector("#chart"), options);
  FChart.render();
};
const sequrityChart = () => {
  console.log("sequrityChart");
  let securityLevel = {
    10: "Todo en orden",
    9: "Trampa de polen retirada",
    8: "Humo en la colmena",
    7: "Humo en la colmena y trampa retirada",
    5: "Movimiento de la colmena",
    4: "Movimiento de la colmena y trampa retirada",
    3: "Humo y movimiento en la colmena",
    2: "Humo, movimiento y trampa de Humo"
  };
  if (currentApiary.length < 1) return;
  let graphData = dataApiaries.find(apiariy => apiariy.apiaryName == currentApiary)
    .hives.find(hive => hive.id == currentHive);
  graphData = graphData.data.map(d => ({
    time: new Date(d.time),
    safe: d.safe
  }));
  seriesData = graphData.map(d => d.safe);

  cleanChartContainer();
  let options = {
    chart: {
      type: 'bar',
      stacked: false,
      height: 500,
      width: "99%",
      zoom: {
        type: 'x',
        enabled: true
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: 'zoom'
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2
    },
    series: [{
      name: 'Estado',
      data: seriesData
    }],
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: graphData.map(d => d.time.toGMTString()),
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Nivel de seguridad',
        style: {
          color: undefined,
          fontSize: '20px',
        },
      },
      min: 0,
      max: 10,
      tickAmount: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return securityLevel[val];
        }
      }
    }
  };
  SChart = new ApexCharts(document.querySelector("#chart"), options);
  SChart.render();
};