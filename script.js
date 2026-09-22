/* ===== Menú móvil ===== */
(function(){
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('open');
    });
    // cerrar al navegar
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }
})();

/* ===== Acordeón FAQ / Beneficios (por lista) ===== */
(function(){
  document.querySelectorAll('.faq-list').forEach(initAccordion);
  function initAccordion(list){
  var items = list.querySelectorAll('.faq-item');
  items.forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    var icon = item.querySelector('.faq-icon');
    if(!q || !a) return;
    // estado inicial: si viene con .open, expandir
    function setOpen(open){
      if(open){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        if(icon) icon.textContent = '–'; // –
        q.setAttribute('aria-expanded','true');
      }else{
        item.classList.remove('open','accent-open');
        a.style.maxHeight = '0px';
        if(icon) icon.textContent = '+';
        q.setAttribute('aria-expanded','false');
      }
    }
    if(item.classList.contains('open')){ setOpen(true); }
    q.addEventListener('click', function(){
      var willOpen = !item.classList.contains('open');
      // acordeón: cerrar los demás
      items.forEach(function(other){
        if(other !== item){
          other.classList.remove('open','accent-open');
          var oa = other.querySelector('.faq-a');
          var oi = other.querySelector('.faq-icon');
          if(oa) oa.style.maxHeight = '0px';
          if(oi) oi.textContent = '+';
          var oq = other.querySelector('.faq-q');
          if(oq) oq.setAttribute('aria-expanded','false');
        }
      });
      setOpen(willOpen);
    });
  });
  }
  // recalcular alto en resize por si cambia el contenido
  window.addEventListener('resize', function(){
    document.querySelectorAll('.faq-item.open .faq-a').forEach(function(a){
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });
})();

/* ===== Tarjetas "El proceso" (servicios): acordeón por click ===== */
(function(){
  var steps = document.querySelectorAll('.step');
  if(!steps.length) return;

  function toggle(step){
    var willOpen = !step.classList.contains('open');
    // acordeón: cerrar los demás
    steps.forEach(function(s){ if(s !== step) s.classList.remove('open'); });
    step.classList.toggle('open', willOpen);
  }

  steps.forEach(function(step){
    step.addEventListener('click', function(){ toggle(step); });
    // teclado / accesibilidad
    step.setAttribute('tabindex','0');
    step.setAttribute('role','button');
    step.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(step); }
    });
  });
})();

/* ===== Carrusel Ecosistema Fynta (coverflow infinito 360°) ===== */
(function(){
  document.querySelectorAll('.eco-carousel').forEach(function(car){
    var stage = car.querySelector('.eco-stage');
    var track = car.querySelector('.eco-track');
    var prev  = car.querySelector('.eco-nav.prev');
    var next  = car.querySelector('.eco-nav.next');
    if(!stage || !track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.eco-card'));
    var n = cards.length;
    if(!n) return;
    var idx = 0;

    function render(){
      var spacing = Math.min(stage.clientWidth * 0.30, 250);
      cards.forEach(function(c, i){
        // distancia con signo más corta al activo (envuelve → loop infinito)
        var slot = ((i - idx) % n + n) % n;
        if(slot > n / 2) slot -= n;
        var a = Math.abs(slot);
        var scale = slot === 0 ? 1.18 : (a === 1 ? 0.82 : 0.64);
        var opacity = a === 0 ? 1 : (a === 1 ? 0.55 : (a === 2 ? 0.22 : 0));
        c.style.transform = 'translate(-50%,-50%) translateX(' + (slot * spacing) + 'px) scale(' + scale + ')';
        c.style.opacity = opacity;
        c.style.zIndex = String(100 - a);
        c.style.pointerEvents = a > 2 ? 'none' : 'auto';
        c.classList.toggle('active', slot === 0);
      });
    }
    function go(delta){ idx = ((idx + delta) % n + n) % n; render(); }

    if(prev) prev.addEventListener('click', function(){ go(-1); });
    if(next) next.addEventListener('click', function(){ go(1); });
    // clic en una tarjeta lateral la enfoca
    cards.forEach(function(c, i){ c.addEventListener('click', function(){ if(i !== idx){ idx = i; render(); } }); });

    // swipe táctil
    var x0 = null;
    stage.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', function(e){
      if(x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      x0 = null;
    });

    window.addEventListener('resize', render);
    // fuerza la carga de todos los logos (el transform no dispara lazy-load)
    track.querySelectorAll('img').forEach(function(img){
      img.loading = 'eager';
      if(!img.complete){
        img.addEventListener('load', render, {once:true});
        img.src = img.src;
      }
    });
    render();
  });
})();

/* ===== Envío de formulario (demo, sin backend) ===== */
(function(){
  var form = document.getElementById('book-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    if(btn){ btn.textContent = '¡Gracias! Te contactamos pronto ✓'; btn.disabled = true; }
  });
})();
