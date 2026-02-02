// Simple interaction + confetti effect
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const overlay = document.getElementById('resultOverlay');
const resultText = document.getElementById('resultText');
const subText = document.getElementById('subText');
const tryAgain = document.getElementById('tryAgain');
const shareBtn = document.getElementById('shareBtn');
const yourName = document.getElementById('yourName');
const crushName = document.getElementById('crushName');

yesBtn.addEventListener('click', () => showResult(true));
noBtn.addEventListener('click', () => showResult(false));
tryAgain.addEventListener('click', closeOverlay);
shareBtn.addEventListener('click', shareResult);

function showResult(isYes){
  const a = yourName.value.trim();
  const b = crushName.value.trim();
  const names = (a || b) ? `${a ? a : 'You'} → ${b ? b : 'Them'}` : '';
  if(isYes){
    resultText.textContent = 'Yes!';
    subText.textContent = names || 'They said yes! 💖';
    startConfetti();
  } else {
    resultText.textContent = 'No';
    subText.textContent = names || "They said no — it's okay. Keep your head up 🙃";
    startSadAnimation();
  }
  overlay.classList.remove('hidden');
  // focus result for accessibility
  resultText.focus?.();
}

function closeOverlay(){
  overlay.classList.add('hidden');
  stopConfetti();
  stopSadAnimation();
}

/* Sharing helper */
function shareResult(){
  const text = `${resultText.textContent} — ${subText.textContent}`;
  if(navigator.share){
    navigator.share({title:'Will they say yes?', text}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text).then(()=> alert('Result copied to clipboard'));
  }
}

/* Confetti (simple canvas particles) */
let confettiTimer = null;
let confettiCtx = null;
let confettiParticles = [];

function startConfetti(){
  const canvas = document.getElementById('confetti');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  confettiCtx = canvas.getContext('2d');
  confettiParticles = createParticles(120);
  cancelAnimationFrame(confettiTimer);
  (function loop(){
    confettiTimer = requestAnimationFrame(loop);
    updateAndDraw(confettiCtx, canvas);
  })();
  // auto stop after 5s
  setTimeout(stopConfetti, 5000);
}

function stopConfetti(){
  cancelAnimationFrame(confettiTimer);
  const canvas = document.getElementById('confetti');
  if(confettiCtx) confettiCtx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles = [];
}

function createParticles(n){
  const colors = ['#ff5aa2','#ffd0e8','#ff9acb','#ff7ab3','#ffffff'];
  const p = [];
  const w = window.innerWidth;
  for(let i=0;i<n;i++){
    p.push({
      x: Math.random()*w,
      y: -Math.random()*200,
      vx: (Math.random()-0.5)*6,
      vy: 2 + Math.random()*6,
      size: 6 + Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      drot: (Math.random()-0.5)*8
    });
  }
  return p;
}

function updateAndDraw(ctx, canvas){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles.forEach((c)=>{
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.05;
    c.rot += c.drot;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot * Math.PI/180);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size*0.6);
    ctx.restore();
  });
  // remove off-screen and add new
  confettiParticles = confettiParticles.filter(p=>p.y < canvas.height + 100);
  while(confettiParticles.length < 100){
    confettiParticles.push(createParticles(1)[0]);
  }
}

/* Sad animation (small subtle shake) */
let sadInterval = null;
function startSadAnimation(){
  const heart = document.querySelector('.heart');
  heart.style.transition = 'transform 0.25s ease';
  heart.style.transform = 'scale(.9) rotate(-6deg)';
  // small pulse back after 1s
  sadInterval = setTimeout(()=>heart.style.transform = 'scale(.98) rotate(0)', 1500);
}

function stopSadAnimation(){
  clearTimeout(sadInterval);
  const heart = document.querySelector('.heart');
  heart.style.transform = '';
}

/* Accessibility: close overlay with Escape */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && !overlay.classList.contains('hidden')) closeOverlay();
});