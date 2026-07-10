const TRACK_STEPS=['booking-requested','booking-confirmed','vehicle-received','diagnosis','awaiting-approval','parts-ordered','repair-in-progress','quality-check','ready','collected'];
const TRACK_LABELS={'booking-requested':'Requested','booking-confirmed':'Confirmed','vehicle-received':'Received','diagnosis':'Diagnosis','awaiting-approval':'Approval','parts-ordered':'Parts ordered','repair-in-progress':'Repairing','quality-check':'Quality check','ready':'Ready','collected':'Collected','cancelled':'Cancelled'};
document.addEventListener('DOMContentLoaded',()=>document.getElementById('track-form').addEventListener('submit',trackJob));
async function trackJob(event){
  event.preventDefault();
  const result=document.getElementById('track-result');
  result.innerHTML='<div class="card track-result">Checking your booking…</div>';
  const job=document.getElementById('job-number').value.trim().toUpperCase();
  const phone=normalisePhone(document.getElementById('track-phone').value);
  try{
    const {data,error}=await sb.rpc('track_booking',{p_job_id:job,p_phone:phone});
    if(error)throw error;
    if(!data||data.length===0){result.innerHTML='<div class="notice notice-error">No matching booking was found. Both the tracking number and mobile number must match.</div>';return;}
    result.innerHTML=renderTracking(data[0]);
  }catch(error){console.error(error);result.innerHTML='<div class="notice notice-error">Tracking is not available yet. Run the supplied Supabase SQL setup first.</div>';}
}
function renderTracking(b){
  const idx=TRACK_STEPS.indexOf(b.status);
  const timeline=b.status==='cancelled'?'<div class="notice notice-error">This booking has been cancelled.</div>':`<div class="timeline">${TRACK_STEPS.map((s,i)=>`<div class="timeline-step ${i<=idx?'done':''}">${TRACK_LABELS[s]}</div>`).join('')}</div>`;
  return `<div class="card track-result"><span class="status-pill">${escapeHtml(TRACK_LABELS[b.status]||b.status)}</span><h2 style="margin-top:16px">${escapeHtml(b.car_make)} · ${escapeHtml(b.plate)}</h2>${timeline}<div class="detail-grid"><div class="detail"><span>Service</span><strong>${escapeHtml(b.service)}</strong></div><div class="detail"><span>Requested date</span><strong>${dateGB(b.preferred_date)}</strong></div><div class="detail"><span>Estimated completion</span><strong>${dateGB(b.deadline)}</strong></div><div class="detail"><span>Estimated price</span><strong>${money(b.est_cost)}</strong></div><div class="detail"><span>Final price</span><strong>${money(b.actual_cost)}</strong></div><div class="detail"><span>Tracking number</span><strong>${escapeHtml(b.id)}</strong></div></div></div>`;
}
