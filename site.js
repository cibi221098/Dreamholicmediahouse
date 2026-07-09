// ============================================================
// Scrubber: fills as the page scrolls, places chapter marks
// at each <section id> found on the page, and keeps the nav's
// matching link highlighted — the site as a piece of media.
// ============================================================
(function(){
  var fill = document.querySelector('.scrubber__fill');
  var head = document.querySelector('.scrubber__head');
  var chapterLayer = document.querySelector('.scrubber__chapters');
  var navLinks = document.querySelectorAll('.chapters a[href^="#"]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main [data-chapter]'));

  function docProgress(){
    var scrollTop = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
  }

  function placeMarks(){
    if(!chapterLayer) return;
    chapterLayer.innerHTML = '';
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if(max <= 0) return;
    sections.forEach(function(sec){
      var pct = (sec.offsetTop / max) * 100;
      var mark = document.createElement('span');
      mark.className = 'scrubber__mark';
      mark.style.left = pct + '%';
      chapterLayer.appendChild(mark);
    });
  }

  function update(){
    var p = docProgress();
    if(fill) fill.style.width = (p * 100) + '%';
    if(head) head.style.left = (p * 100) + '%';

    // active chapter highlight
    var scrollPos = window.scrollY + window.innerHeight * 0.3;
    var current = null;
    sections.forEach(function(sec){
      if(sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function(a){
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', function(){ placeMarks(); update(); });
  placeMarks();
  update();
})();

// ============================================================
// Reel cursor: a small orange play-badge that follows the
// pointer while hovering a .reel card, replacing the system
// cursor to reinforce "press play" on hover.
// ============================================================
(function(){
  var dot = document.querySelector('.cursor-dot');
  if(!dot) return;
  var reels = document.querySelectorAll('.reel');
  var raf = null, x = 0, y = 0;

  function move(e){
    x = e.clientX; y = e.clientY;
    if(raf) return;
    raf = requestAnimationFrame(function(){
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) scale(1)';
      raf = null;
    });
  }

  reels.forEach(function(r){
    r.addEventListener('mouseenter', function(){
      dot.classList.add('is-active');
      document.addEventListener('mousemove', move);
    });
    r.addEventListener('mouseleave', function(){
      dot.classList.remove('is-active');
      document.removeEventListener('mousemove', move);
    });
  });
})();

// ============================================================
// Mobile nav toggle
// ============================================================
(function(){
  var burger = document.querySelector('.nav__burger');
  var chapters = document.querySelector('.chapters');
  if(!burger || !chapters) return;
  burger.addEventListener('click', function(){
    var open = chapters.style.display === 'flex';
    chapters.style.display = open ? 'none' : 'flex';
    chapters.style.flexDirection = 'column';
    chapters.style.position = 'absolute';
    chapters.style.top = '100%';
    chapters.style.left = '0';
    chapters.style.right = '0';
    chapters.style.background = '#1B1B2C';
    chapters.style.padding = '20px var(--edge)';
    chapters.style.borderBottom = '1px solid rgba(245,245,240,0.1)';
    chapters.style.gap = '18px';
  });
})();

// ============================================================
// Contact form: local-only handling (no backend wired up yet)
// ============================================================
(function(){
  var form = document.querySelector('#contact-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var note = document.querySelector('#form-status');
    if(note){
      note.textContent = 'This form isn\u2019t wired to an inbox yet \u2014 connect it to your email or CRM before launch.';
    }
  });
})();
