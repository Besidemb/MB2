/* ====================== State & defaults ====================== */
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

/* ====================== Load & Save ====================== */
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

/* ====================== Apply settings ====================== */
function applySettingsToUI(){
  const s = state.settings;
  document.documentElement.style.setProperty('--accent', s.accent);
  document.documentElement.style.setProperty('--accent-2', s.accent2);
  document.documentElement.style.setProperty('--glow', s.glow);
  document.documentElement.style.setProperty('--font-family', s.font);
  document.documentElement.style.fontSize = s.fontsize + 'px';
  document.getElementById('sit
