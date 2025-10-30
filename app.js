// Canvas de estrelas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for(let i=0;i<200;i++){
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.5,
    dx: (Math.random()-0.5)*0.2,
    dy: (Math.random()-0.5)*0.2
  });
}

function animateStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let s of stars){
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle="#fff";
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if(s.x<0) s.x=canvas.width;
    if(s.x>canvas.width) s.x=0;
    if(s.y<0) s.y=canvas.height;
    if(s.y>canvas.height) s.y=0;
  }
  requestAnimationFrame(animateStars);
}
animateStars();

// Perfis e moedas
let profiles = { mb:{moedas:100,notas:''}, nath:{moedas:100,notas:''} };
let coinStep = 10;
let logged = null;

window.onload = () => { carregarDados(); atualizarUI(); mostrarLogin(); }

function atualizarUI(){
  document.getElementById('moedas-mb').textContent = profiles.mb.moedas;
  document.getElementById('moedas-nath').textContent = profiles.nath.moedas;
  document.getElementById('notas-mb').textContent = profiles.mb.notas;
  document.getElementById('notas-nath').textContent = profiles.nath.notas;
  document.getElementById('logged-as').textContent = logged || '—';
}

function alterarMoedas(profile,qtd){
  if(!logged){ alert('Faça login!'); return; }
  profiles[profile].moedas+=qtd;
  if(profiles[profile].moedas<0) profiles[profile].moedas=0;
  atualizarUI();
  salvarDados();
}

function resetProfile(profile){
  if(!logged){ alert('Faça login!'); return; }
  profiles[profile].moedas=100;
  profiles[profile].notas='';
  atualizarUI();
  salvarDados();
}

function exportProfile(profile){
  prompt('Copie este JSON:',JSON.stringify(profiles[profile]));
}

function salvarDados(){ localStorage.setItem('nosso-cantinho',JSON.stringify(profiles)); }
function carregarDados(){ const data=localStorage.getItem('nosso-cantinho'); if(data) profiles=JSON.parse(data); }

function salvarAjustes(){
  const accent=document.getElementById('input-accent').value;
  const accent2=document.getElementById('input-accent2').value;
  const font=document.getElementById('input-font').value;
  const fontsize=document.getElementById('input-fontsize').value;
  coinStep=Number(document.getElementById('input-step').value);
  document.body.style.setProperty('--accent',accent);
  document.body.style.setProperty('--accent2',accent2);
  document.body.style.fontFamily=font;
  document.body.style.fontSize=fontsize+'px';
  document.title=document.getElementById('input-title').value;
}

function resetAjustes(){
  document.getElementById('input-accent').value='#b57bff';
  document.getElementById('input-accent2').value='#6f3ec9';
  document.getElementById('input-font').value='Poppins, sans-serif';
  document.getElementById('input-fontsize').value=16;
  document.getElementById('input-step').value=10;
  document.getElementById('input-title').value='Nosso Cantinho 💜';
  salvarAjustes();
}

function mostrarLogin(){ document.getElementById('login-modal').style.display='flex'; }
function startLogin(user){ logged=user; document.getElementById('login-pass').value=''; }
function confirmLogin(){
  const pass=document.getElementById('login-pass').value;
  if(pass==='9898'){ document.getElementById('login-modal').style.display='none'; atualizarUI(); }
  else alert('Senha incorreta!');
}
function logout(){ logged=null; mostrarLogin(); atualizarUI(); }

function sendComposer(){
  const input=document.getElementById('message-input');
  if(!logged){ alert('Faça login!'); return; }
  if(input.value.trim()==='') return;
  const msg=document.createElement('div');
  msg.textContent=logged+': '+input.value;
  document.getElementById('messages').appendChild(msg);
  input.value='';
}

function exportAll(){ prompt('Copie o backup completo:',JSON.stringify(profiles)); }
function importPrompt(){ 
  const data=prompt('Cole o JSON de backup:');
  if(!data) return;
  try{ profiles=JSON.parse(data); salvarDados(); atualizarUI(); }
  catch(e){ alert('JSON inválido!'); }
}
