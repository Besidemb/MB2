/* ====================== State & defaults ====================== */
const STORAGE_KEY = 'nossoCantinho_definitive_v1';
const PASSWORD = '9898';
const DEFAULTS = {
  settings: { accent:'#b57bff', accent2:'#6f3ec9', glow:1.2, font:"Poppins, sans-serif", fontsize:16, step:10, stars:true, title:"Nosso Cantinho 💜" },
  profiles: { mb: {notas:'', moedas:100}, nath: {notas:'', moedas:100} },
  messages: []
};

let state = loadState() || DEFAULTS;
let currentLoginTarget = null;
let currentUser = null;

/* ====================== Load & Save ====================== */
function loadState(){ try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch(e){ console.warn(e); return null; } }
function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){ console.warn(e); } }

/* ====================== Apply settings ====================== */
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

/* ====================== Profiles ====================== */
function renderProfiles(){
  const mbNotas = document.getElementById('notas-mb'), mbMoedas = document.getElementById('moedas-mb');
  const nathNotas = document.getElementById('notas-nath'), nathMoedas = document.getElementById('moedas-nath');
  if(mbNotas) mbNotas.innerText = state.profiles.mb.notas || '';
  if(mbMoedas) mbMoedas.textContent = state.profiles.mb.moedas ?? 0;
  if(nathNotas) nathNotas.innerText = state.profiles.nath.notas || '';
  if(nathMoedas) nathMoedas.textContent = state.profiles.nath.moedas ?? 0;
}
function alterarMoedas(profile, valor){ const p = state.profiles[profile]; if(!p) return; p.moedas = Math.max(0, (Number(p.moedas)||0)+Number(valor)); saveState(); renderProfiles(); }
function getCoinStep(){ return Number(state.settings.step)||10; }

/* ====================== Messages ====================== */
function generateId(){ return 'm_' + Math.random().toString(36).slice(2,9); }
function sendMessage(from,text){ if(!text||!from) return; state.messages.push({ id:generateId(), from, text:text.trim(), time:(new Date()).toISOString(), deleteRequests:{mb:false,nath:false} }); saveState(); renderMessages(); scrollMessagesToBottom(); }
function sendComposer(){ if(!currentUser){ alert('Faça login'); return; } const input=document.getElementById('message-input'); if(!input) return; const text=input.value.trim(); if(!text) return; sendMessage(currentUser,text); input.value=''; }
function renderMessages(){ const c=document.getElementById('messages'); if(!c) return; c.innerHTML=''; state.messages.forEach(m=>{ const el=document.createElement('div'); el.className='msg '+(m.from===currentUser?'me':'them'); const h=document.createElement('div'); h.style.fontWeight='700'; h.textContent=m.from==='mb'?'MB':'Nath'; el.appendChild(h); const t=document.createElement('div'); t.style.whiteSpace='pre-wrap'; t.style.marginTop='6px'; t.textContent=m.text; el.appendChild(t); c.appendChild(el); }); }
function scrollMessagesToBottom(){ const c=document.getElementById('messages'); if(!c) return; setTimeout(()=>{ c.scrollTop=c.scrollHeight; },40); }

/* ====================== Login flow ====================== */
function startLogin(target){ currentLoginTarget=target; const m=document.getElementById('login-modal'); if(m) m.style.display='flex'; }
function confirmLogin(){ const passInput=document.getElementById('login-pass'); const pass=passInput?passInput.value:''; if(pass===PASSWORD && currentLoginTarget){ currentUser=currentLoginTarget; const m=document.getElementById('login-modal'); if(m)m.style.display='none'; const l=document.getElementById('logged-as'); if(l) l.textContent=currentUser.toUpperCase(); renderMessages(); scrollMessagesToBottom(); } else{ alert('Senha incorreta'); } }
function logout(){ currentUser=null; const l=document.getElementById('logged-as'); if(l) l.textContent='—'; }

/* ====================== Notes autosave ====================== */
function hookNotesAutoSave(){ ['mb','nath'].forEach(id=>{ const el=document.getElementById('notas-'+id); if(el){ el.addEventListener('input',()=>{ state.profiles[id].notas=el.innerText; saveState(); }); } }); }

/* ====================== Stubs ====================== */
function resetProfile(p){ console.log
