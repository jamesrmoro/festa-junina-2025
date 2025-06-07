// 1. MENU LATERAL
const menu      = document.getElementById('menuLateralFJ');
const btnMenu   = document.getElementById('btnMenuFJ');
const menuIcon  = document.getElementById('menuIcon');
let aberto = false;

function toggleMenuFJ() {
  aberto = !aberto;
  menu.classList.toggle('aberta', aberto);
  if (aberto) {
    btnMenu.classList.add('fechar');
    btnMenu.setAttribute('aria-label', 'Fechar menu');
    menuIcon.innerHTML = '✖';
  } else {
    btnMenu.classList.remove('fechar');
    btnMenu.setAttribute('aria-label', 'Abrir menu');
    menuIcon.innerHTML = '☰';
  }
}

btnMenu.addEventListener('click', function(e){
  e.stopPropagation();
  toggleMenuFJ();
});
document.addEventListener('click', function(e){
  if (aberto && !menu.contains(e.target) && !btnMenu.contains(e.target)) {
    aberto = false;
    menu.classList.remove('aberta');
    btnMenu.classList.remove('fechar');
    btnMenu.setAttribute('aria-label', 'Abrir menu');
    menuIcon.innerHTML = '☰';
  }
});
document.addEventListener('keydown', function(e){
  if (e.key === "Escape" && aberto) {
    aberto = false;
    menu.classList.remove('aberta');
    btnMenu.classList.remove('fechar');
    btnMenu.setAttribute('aria-label', 'Abrir menu');
    menuIcon.innerHTML = '☰';
  }
});

// 2. BANDEIRINHAS SVG
const colors = ["#f44336","#fbc02d","#43a047","#1976d2","#8e24aa","#ef6c00"];
const flags = [];
const n = 20;
const path = document.getElementById("pathbandeirinhas");
const totalLen = path.getTotalLength();

for(let i=0;i<n;i++){
  let pct = i/(n-1);
  let pt = path.getPointAtLength(totalLen * pct);
  let next = path.getPointAtLength(totalLen * Math.min(pct+0.02,1));
  let dx = next.x - pt.x, dy = next.y - pt.y;
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  let color = colors[i%colors.length];
  flags.push(`<polygon points="${pt.x-13},${pt.y} ${pt.x},${pt.y+32} ${pt.x+13},${pt.y}"
    fill="${color}" stroke="#222" stroke-width="1.4"
    transform="rotate(${angle} ${pt.x} ${pt.y})"/>`);
}
document.getElementById("flags").innerHTML = flags.join("");

// 3. ESTRELAS NO FUNDO (Canvas)
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
function resizeCanvas() {
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const numStars = 200;
let stars = [];
function genStars(){
  stars = [];
  for(let i=0;i<numStars;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H*0.88,
      r: Math.random()*1.6+0.2,
      o: Math.random()*0.55+0.4
    });
  }
}
genStars();
window.addEventListener('resize', genStars);

function drawStars(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    ctx.globalAlpha = s.o * (0.5 + Math.sin(Date.now()/350 + s.x + s.y) * 0.3);
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha=1;
  requestAnimationFrame(drawStars);
}
drawStars();

// 4. ESTRELA CADENTE
const estrela = document.querySelector('.estrela-cadente');
function startEstrelaCadente() {
  estrela.style.opacity = '1';
  estrela.style.transition = 'none';
  estrela.style.left = '-140px';
  estrela.style.top = (Math.random()*28+6)+'vh';
  setTimeout(()=>{
    estrela.style.transition = 'left 1.3s cubic-bezier(.4,0,.99,.43), opacity 1.2s';
    estrela.style.left = (window.innerWidth+160)+'px';
    estrela.style.opacity = '0';
  }, 40);
  setTimeout(()=>{
    estrela.style.transition = 'none';
    estrela.style.left = '-140px';
    estrela.style.opacity = '0';
  }, 1500);
}
function loopEstrelaCadente(){
  setTimeout(()=>{
    startEstrelaCadente();
    loopEstrelaCadente();
  }, Math.random()*7000+5000);
}
loopEstrelaCadente();

// 5. BALÃO
const balao = document.getElementById('balao2');
balao.addEventListener('animationend', () => {
  balao.parentNode && balao.parentNode.removeChild(balao);
});

// 6. BARRACAS & MODAIS
const barracaComida = document.getElementById('barracaComida');
const modalComida = document.getElementById('modalComida');
barracaComida.addEventListener('click', function(e){
  e.stopPropagation();
  modalComida.classList.add('active');
});
function closeModal() {
  modalComida.classList.remove('active');
}
modalComida.addEventListener('click', function(e){
  if(e.target === modalComida) closeModal();
});

const barracaJogos = document.querySelector('.barraca.jogos');
const modalJogos = document.getElementById('modalJogos');
barracaJogos.addEventListener('click', function(e){
  e.stopPropagation();
  modalJogos.classList.add('active');
});
function closeModalJogos() {
  modalJogos.classList.remove('active');
}
modalJogos.addEventListener('click', function(e){
  if(e.target === modalJogos) closeModalJogos();
});

const barracaCorreio = document.getElementById('barracaCorreio');
const modalCorreio = document.getElementById('modalCorreio');
barracaCorreio.addEventListener('click', function(e){
  e.stopPropagation();
  modalCorreio.classList.add('active');
});
function closeModalCorreio() {
  modalCorreio.classList.remove('active');
}
modalCorreio.addEventListener('click', function(e){
  if(e.target === modalCorreio) closeModalCorreio();
});

// ESC fecha modais
document.addEventListener('keydown', function(e){
  if(e.key === "Escape") {
    closeModal();
    closeModalJogos();
    closeModalCorreio();
  }
});

// 7. TOOLTIP DAS COMIDAS/JOGOS
(function() {
  let tooltip;
  document.body.addEventListener('mouseover', function(e) {
    let el = e.target.closest('.modal-jogos .comida-card[data-tip], .modal-comida .comida-card[data-tip]');
    if (el) {
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip-jn';
        document.body.appendChild(tooltip);
      }
      tooltip.innerText = el.getAttribute('data-tip');
      tooltip.classList.add('show');
      positionTooltip(e);
    }
  });
  document.body.addEventListener('mousemove', function(e) {
    if (tooltip && tooltip.classList.contains('show')) {
      positionTooltip(e);
    }
  });
  document.body.addEventListener('mouseout', function(e) {
    let el = e.target.closest('.modal-jogos .comida-card[data-tip], .modal-comida .comida-card[data-tip]');
    if (el && tooltip) {
      tooltip.classList.remove('show');
    }
  });
  function positionTooltip(e) {
    if (tooltip) {
      let x = e.clientX + 16;
      let y = e.clientY - 12;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  }
})();

// 8. SANFONA FLUTUANTE
const sanfona = document.getElementById('sanfonaFloat');
const audio = document.getElementById('audioSanfona');
sanfona.classList.remove('animando');
function startAnimacaoSanfona() {
  sanfona.classList.add('animando');
}
function stopAnimacaoSanfona() {
  sanfona.classList.remove('animando');
}
sanfona.addEventListener('click', function(e){
  e.stopPropagation();
  if (audio.paused) {
    audio.currentTime = 0;
    audio.play();
    startAnimacaoSanfona();
  } else {
    audio.pause();
    stopAnimacaoSanfona();
  }
});
audio.addEventListener('ended', stopAnimacaoSanfona);
audio.addEventListener('pause', stopAnimacaoSanfona);
audio.addEventListener('play', startAnimacaoSanfona);

// 9. FOGOS DE ARTIFÍCIO
const canvasFogos = document.getElementById('fogos');
let wFogos = window.innerWidth, hFogos = window.innerHeight;
function resizeFogos(){
  wFogos = window.innerWidth;
  hFogos = window.innerHeight;
  canvasFogos.width = wFogos;
  canvasFogos.height = hFogos;
}
resizeFogos();
window.addEventListener('resize', resizeFogos);

let fogos = [];
function dispararFogo(x, y) {
  const cores = ["#ffe082", "#ff9800", "#e53935", "#5bffaf", "#ff79f2", "#3fa9ff", "#e8c155", "#fff"];
  const numParticulas = 34 + Math.floor(Math.random() * 18);
  for (let i = 0; i < numParticulas; i++) {
    const ang = (i / numParticulas) * Math.PI * 2;
    const vel = 3.8 + Math.random() * 1.8;
    fogos.push({
      x: x, y: y,
      vx: Math.cos(ang) * vel * (0.94 + Math.random()*0.13),
      vy: Math.sin(ang) * vel * (0.94 + Math.random()*0.13),
      r: 2.4 + Math.random() * 2.5,
      color: cores[Math.floor(Math.random() * cores.length)],
      life: 0,
      max: 32 + Math.random() * 18
    });
  }
}
function loopFogos() {
  const ctxF = canvasFogos.getContext('2d');
  ctxF.clearRect(0, 0, wFogos, hFogos);
  for (let i = fogos.length - 1; i >= 0; i--) {
    let p = fogos[i];
    ctxF.globalAlpha = 1 - p.life / p.max;
    ctxF.beginPath();
    ctxF.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctxF.fillStyle = p.color;
    ctxF.shadowColor = p.color;
    ctxF.shadowBlur = 13;
    ctxF.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06 + p.life * 0.0017;
    p.life++;
    if (p.life > p.max) fogos.splice(i, 1);
  }
  ctxF.globalAlpha = 1;
  requestAnimationFrame(loopFogos);
}
loopFogos();

function autoFogo() {
  const x = 80 + Math.random() * (wFogos - 160);
  const y = 70 + Math.random() * (hFogos * 0.24);
  dispararFogo(x, y);
  setTimeout(autoFogo, 1500 + Math.random() * 1900);
}
autoFogo();

// 10. CLIQUE PARA FOGOS
document.body.addEventListener('click', function(e){
  if(document.querySelector('.modal-bg.active')) return;
  let x = e.clientX, y = e.clientY;
  dispararFogo(x, y);
});
document.body.addEventListener('touchstart', function(e){
  if(document.querySelector('.modal-bg.active')) return;
  let t = e.touches[0];
  dispararFogo(t.clientX, t.clientY);
});
