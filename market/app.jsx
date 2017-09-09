import $ from 'jquery';
import io from 'socket.io-client';

$(function () {
  let socket = io('http://localhost:3030/view');
  let $body = $('body');
  let $images = $('img');

  let $baseStyle = $('<link />').attr('href','http://localhost:3030/app.css').attr('rel', 'stylesheet');
  $('head').append($baseStyle);

  socket.on('midi:knob 16', function (val) {
    console.log(val,2);
    let rgb = HSVtoRGB(val*2,255,255);
    $('p, a').css({
      'cssText': 'color: rgba('+rgb.r+','+rgb.g+','+rgb.b+',1)!important;'
    })
  });

  socket.on('midi:button 32', function(val) {
    let rnd = Math.floor(Math.random() * $images.length);
    $images[rnd].addClass('bigSmall');
  })

  console.log($images.length);
  function HSVtoRGB (h, s, v) {
    var r, g, b; // 0..255
    while (h < 0) {
      h += 360;
    }
    h = h % 360;
    if (s == 0) {
      // → RGB は V に等しい
      v = Math.round(v);
      return {'r': v, 'g': v, 'b': v};
    }
    s = s / 255;
    var i = Math.floor(h / 60) % 6,
      f = (h / 60) - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)
    switch (i) {
      case 0 :
        r = v;  g = t;  b = p;  break;
      case 1 :
        r = q;  g = v;  b = p;  break;
      case 2 :
        r = p;  g = v;  b = t;  break;
      case 3 :
        r = p;  g = q;  b = v;  break;
      case 4 :
        r = t;  g = p;  b = v;  break;
      case 5 :
        r = v;  g = p;  b = q;  break;
    }
    return {'r': Math.round(r), 'g': Math.round(g), 'b': Math.round(b)};
  }


  // $('img').attr('src','http://www.iamas.ac.jp/wordpress/wp-content/uploads/portrait_mmiwa.jpg')
});