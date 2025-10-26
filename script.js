/* ====== Confetti (canvas) ====== */
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function rand(min,max){ return Math.random()*(max-min)+min; }
function createParticle(){
  return {
    x: rand(0, confettiCanvas.width),
    y: rand(-confettiCanvas.height, 0),
    r: rand(6,12),
    d: rand(10,30),
    color: ['#ffd1e8','#cfa3ff','#ffd36a','#69f0c7','#ffb6c6'][Math.floor(rand(0,5))],
    tilt: rand(-10,10),
    tiltSpeed: rand(0.02, 0.08),
    velocityY: rand(0.6, 2.2)
  };
}
function initConfetti(count=120){
  confettiParticles = [];
  for(let i=0;i<count;i++) confettiParticles.push(createParticle());
}
function updateConfetti(){
  for(let p of confettiParticles){
    p.y += p.velocityY;
    p.tilt += p.tiltSpeed;
    if(p.y > confettiCanvas.height + 20){ Object.assign(p, createParticle()); p.y = rand(-100, -10); }
  }
}
function drawConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  for(let p of confettiParticles){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.tilt * Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
  }
}
function confettiLoop(){
  updateConfetti(); drawConfetti();
  requestAnimationFrame(confettiLoop);
}
initConfetti();
confettiLoop();

/* ====== Music toggle ====== */
const bg = document.getElementById('bg-music');
const btn = document.getElementById('toggle-music');
let playing = false;
btn.addEventListener('click', ()=>{
  if(!playing){ bg.play().catch(()=>{}); btn.textContent='🔊 Pause'; playing=true; }
  else{ bg.pause(); btn.textContent='🔈 Play'; playing=false; }
});

/* Autoplay attempt: browsers block autoplay with sound. Try muted start then unmute on click */
bg.muted = true;
bg.play().then(()=>{ /* muted started */ }).catch(()=>{});
window.addEventListener('click', function handler(){
  // unmute only when user interacts
  bg.muted = false;
  window.removeEventListener('click', handler);
});

/* ====== Simple slider (auto & manual) ====== */
const slides = document.querySelectorAll('.slide');
let idx = 0;
function showSlide(i){
  const wrapper = document.querySelector('.slider');
  const offset = i * (wrapper.querySelector('.slide').getBoundingClientRect().width + 18);
  wrapper.scrollTo({ left: offset, behavior:'smooth' });
}
document.getElementById('prev').addEventListener('click', ()=>{
  idx = Math.max(0, idx-1); showSlide(idx);
});
document.getElementById('next').addEventListener('click', ()=>{
  idx = Math.min(slides.length-1, idx+1); showSlide(idx);
});
// auto slide every 5s
setInterval(()=>{ idx = (idx+1) % slides.length; showSlide(idx); }, 5000);

/* ====== Poem typing animation ====== */
const poemEl = document.getElementById('poem-text');
const full = poemEl.dataset.fulltext || poemEl.textContent;
poemEl.textContent = '';
let t = 0;
function typePoem(){
  if(t <= full.length){
    poemEl.textContent = full.slice(0,t);
    t++;
    setTimeout(typePoem, 30 + Math.random()*40);
  } else {
    // small glow at end
    poemEl.style.transition = 'opacity .6s ease';
    poemEl.style.opacity = '1';
  }
}
setTimeout(typePoem, 900);

/* ====== Create gentle entrance animations for sections ====== */
document.addEventListener('DOMContentLoaded', ()=>{
  const sections = document.querySelectorAll('section');
  sections.forEach((s,i)=>{
    s.style.opacity = 0;
    s.style.transform = 'translateY(18px)';
    setTimeout(()=>{ s.style.transition = 'all .8s cubic-bezier(.2,.9,.2,1)'; s.style.opacity=1; s.style.transform='translateY(0)'; }, 400 + i*150);
  });
});

/* ====== Accessibility: allow keyboard control of music and slides ====== */
document.addEventListener('keydown', (e)=>{
  if(e.key === ' '){ // space toggles music
    e.preventDefault();
    btn.click();
  } else if(e.key === 'ArrowRight'){
    document.getElementById('next').click();
  } else if(e.key === 'ArrowLeft'){
    document.getElementById('prev').click();
  }
});
