$(document).ready(() => {
  let currentApiary = "";
  let currentHive = "";
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
    currentApiary = $($(e.target).parent().children()[0]).text();
    currentHive = $(e.target).text();
    console.log(currentApiary + " - " + currentHive);
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
      case "Humedad y Temperatura Externa":
        humTempIntChart();
        break;
      case "Humedad y Temperatura Interna":
        humTempExtChart();
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
});

const humTempIntChart = () => {
  console.log("humTempIntChart");
}
const humTempExtChart = () => {
  console.log("humTempExtChart");
}
const fumesChart = () => {
  console.log("fumesChart");
}
const sequrityChart = () => {
  console.log("sequrityChart");
}