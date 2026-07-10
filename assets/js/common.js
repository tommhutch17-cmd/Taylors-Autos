const cfg = window.APP_CONFIG || {};
const supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
window.sb = supabaseClient;

function toggleMenu(){ document.querySelector('.navlinks')?.classList.toggle('open'); }
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}
function money(value){ return value === null || value === undefined || value === '' ? 'Not set' : `£${Number(value).toFixed(2)}`; }
function dateGB(value){ if(!value) return 'Not set'; return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
function normalisePhone(value){ return String(value || '').replace(/\D/g,''); }
function showMessage(id,text,type='info'){
  const el=document.getElementById(id); if(!el)return;
  el.className=`notice notice-${type}`; el.textContent=text; el.classList.remove('hidden');
}
function makeJobId(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random=Array.from({length:7},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
  return `TA-${random}`;
}
