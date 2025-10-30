const STORAGE_KEY = 'nossoCantinho_definitive_v1';
const PASSWORD = '9898';
const DEFAULTS = {
  settings: {
    accent:'#b57bff', accent2:'#6f3ec9', glow:1.2, font:"Poppins, sans-serif",
    fontsize:16, step:10, stars:true, title:"Nosso Cantinho 💜"
  },
  profiles: {
    mb: {notas:'', moedas:100},
    nath: {notas:'', moedas:100}
  },
  messages: []
};

let state = loadState() || DEFAULTS;
let currentLoginTarget = null;
let currentUser = null;

/* ===== Load & Save ===== */
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ console.warn(e); return null; }
}
function saveState(){ 
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } 
  catch(e){ console.warn(e); } 
}

/* ===== Apply settings ===== */
function applySettingsToUI(){
  const s = state.settings;
  document.documentElement.style.setProperty('--accent', s.accent);
  document.documentElement.style.setProperty('--accent-2', s.accent2);
  document.documentElement.style.setProperty('--glow', s.glow);
  document.documentElement.style.setProperty('--font-family', s.font);
  document.documentElement.style.fontSize = s.fontsize + 'px';
  const titleEl = document.getElementById('site-title');
  if(titleEl) titleEl.textContent = s.title;
}

/* ===== Profiles ===== */
function renderProfiles(){
  const mbNotas = document.getElementById('notas-mb');
  const mbMoedas = document.getElementById('moedas-mb');
  const nathNotas = document.getElementById('notas-nath');
  const nathMoedas = document.getElementById('moedas-nath');

  if(mbNotas) mbNotas.innerText = state.profiles.mb.notas || '';
  if(mbMoedas) mbMoedas.textContent = state.profiles.mb.moedas ?? 0;
  if(nathNotas) nathNotas.innerText = state.profiles.nath.notas || '';
  if(nathMoedas) nathMoedas.textContent = state.profiles.nath.moedas ?? 0;
}

function alterarMoedas(profile, valor){
  const p = state.profiles[profile];
  if(!p) return;
  p.moedas = Math.max(0, (Number(p.moedas)||0) + Number(valor));
  saveState(); renderProfiles();
}

function getCoinStep(){ return Number(state.settings.step) || 10; }

/* ===== Messages ===== */
function generateId(){ return 'm_' + Math.random().toString(36).slice(2,9); }

function sendMessage(from, text){
  if(!text || !from) return;
  const msg = { id: generateId(), from, text:text.trim(), time:(new Date()).toISOString(), deleteRequests:{mb:false,nath:false} };
  state.messages.push(msg);
  saveState(); renderMessages(); scrollMessagesToBottom();
}

function sendComposer(){
  if(!currentUser){ alert('Faça login'); return; }
  const input = document.getElementById('message-input');
  if(!input) return;
  const text = input.value.trim();
  if(!text) return;
  sendMessage(currentUser, text);
  input.value = '';
}

function renderMessages(){
  const container = document.getElementById('messages');
  if(!container) return;
  container.innerHTML = '';
  state.messages.forEach(m=>{
    const el = document.createElement('div');
    el.className = 'msg ' + (m.from === currentUser ? 'me' : 'them');

    const header = document.createElement('div');
    header.style.fontWeight='700';
    header.textContent = m.from === 'mb' ? 'MB' : 'Nath';
    el.appendChild(header);

    const text = document.createElement('div');
    text.style.whiteSpace='pre-wrap';
    text.style.marginTop='6px';
    text.textContent = m.text;
    el.appendChild(text);

    container.appendChild(el);
  });
}

function scrollMessagesToBottom(){
  const c = document.getElementById('messages');
  if(!c) return;
  setTimeout(()=>{ c.scrollTop = c.scrollHeight; }, 40);
}

/* ===== Login ===== */
function startLogin(target){ 
  currentLoginTarget = target; 
  const modal = document.getElementById('login-modal');
  if(modal) modal.style.display='flex'; 
}

function confirmLogin(){
  const passInput = document.getElementById('login-pass');
  const pass = passInput ? passInput.value : '';
  if(pass===PASSWORD && currentLoginTarget){
    currentUser = currentLoginTarget;
    const modal = document.getElementById('login-modal');
    if(modal) modal.style.display='none';
    renderMessages();
    scrollMessagesToBottom();
  } else { alert('Senha incorreta'); }
}

/* ===== Init ===== */
function hookNotesAutoSave(){
  ['mb','nath'].forEach(id=>{
    const el = document.getElementById('notas-'+id);
    if(el){
      el.addEventListener('input', ()=> { 
        state.profiles[id].notas = el.innerText; 
        saveState(); 
      });
    }
  });
}

function init(){
  applySettingsToUI(); 
  renderProfiles(); 
  hookNotesAutoSave();

  const input = document.getElementById('message-input');
  if(input){
    input.addEventListener('keydown', function(e){
      if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendComposer(); }
    });
  }
}

init(); 
/* ====================== Fundo animado de estrelas ====================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let stars = [];

function resizeCanvas(){
  if(!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars(count=100){
  stars = [];
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.5 + 0.5,
      alpha: Math.random(),
      dx: (Math.random()-0.5)*0.1,
      dy: (Math.random()-0.5)*0.1
    });
  }
}
createStars(150);

function drawStars(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if(s.x<0) s.x=canvas.width;
    if(s.x>canvas.width) s.x=0;
    if(s.y<0) s.y=canvas.height;
    if(s.y>canvas.height) s.y=0;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

saveState();
