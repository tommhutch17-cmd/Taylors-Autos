document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('booking-form');
  const date=document.getElementById('preferred-date');
  date.min=new Date().toISOString().split('T')[0];
  form.addEventListener('submit',submitBooking);
});
async function submitBooking(event){
  event.preventDefault();
  const btn=event.currentTarget.querySelector('button[type=submit]');
  btn.disabled=true; btn.textContent='Sending request…';
  const row={
    id:makeJobId(),
    name:document.getElementById('name').value.trim(),
    phone:normalisePhone(document.getElementById('phone').value),
    email:document.getElementById('email').value.trim()||null,
    car_make:document.getElementById('vehicle').value.trim(),
    plate:document.getElementById('plate').value.trim().toUpperCase(),
    service:document.getElementById('service').value,
    preferred_date:document.getElementById('preferred-date').value,
    notes:document.getElementById('notes').value.trim()||null,
    status:'booking-requested',
    est_cost:null,actual_cost:null,parts_cost:null,deadline:null,
    created_at:Date.now(),ready_notified_at:null
  };
  try{
    const {error}=await sb.from('bookings').insert(row);
    if(error)throw error;
    event.currentTarget.reset();
    document.getElementById('booking-success').innerHTML=`<strong>Request received.</strong><br>Your tracking number is <strong>${escapeHtml(row.id)}</strong>. Taylor's Autos still needs to confirm the appointment. Save this number and use it with your mobile number on the tracking page.`;
    document.getElementById('booking-success').classList.remove('hidden');
    document.getElementById('booking-success').scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){
    console.error(error);showMessage('booking-error','The request could not be saved. Check the Supabase setup or try again.','error');
  }finally{btn.disabled=false;btn.textContent='Request my booking';}
}
