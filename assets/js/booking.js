document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('booking-form');
  const date=document.getElementById('preferred-date');
  if(date) date.min=new Date().toISOString().split('T')[0];
  if(form) form.addEventListener('submit',submitBooking);
});

async function submitBooking(event){
  event.preventDefault();

  const form=event.currentTarget;
  const btn=form.querySelector('button[type=submit]');
  const successEl=document.getElementById('booking-success');
  const errorEl=document.getElementById('booking-error');

  successEl?.classList.add('hidden');
  errorEl?.classList.add('hidden');
  btn.disabled=true;
  btn.textContent='Sending request…';

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
    est_cost:null,
    actual_cost:null,
    parts_cost:null,
    deadline:null,
    created_at:Date.now(),
    ready_notified_at:null
  };

  try{
    const {error}=await sb.from('bookings').insert(row);

    if(error){
      // Some Supabase setups can return an auth/RLS error after the row has
      // actually been written. Verify through the secure tracker before
      // showing the customer a failure message or encouraging a duplicate.
      const {data:verified,error:verifyError}=await sb.rpc('track_booking',{
        p_job_id:row.id,
        p_phone:row.phone
      });

      const saved=Array.isArray(verified) ? verified.length>0 : Boolean(verified);
      if(!saved){
        console.error('Booking insert failed:',error);
        if(verifyError) console.error('Booking verification failed:',verifyError);
        throw error;
      }
    }

    form.reset();
    if(document.getElementById('preferred-date')){
      document.getElementById('preferred-date').min=new Date().toISOString().split('T')[0];
    }

    successEl.innerHTML=`<strong>Request received.</strong><br>Your tracking number is <strong>${escapeHtml(row.id)}</strong>. Taylor's Autos still needs to confirm the appointment. Save this number and use it with your mobile number on the tracking page.`;
    successEl.classList.remove('hidden');
    successEl.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){
    console.error('Full booking error:',error);
    const detail=error?.message ? ` (${escapeHtml(error.message)})` : '';
    errorEl.innerHTML=`<strong>The request could not be saved.</strong><br>Please call Taylor's Autos on <a href="tel:01745350621">01745 350621</a> or try again.${detail}`;
    errorEl.className='notice notice-error';
    errorEl.classList.remove('hidden');
    errorEl.scrollIntoView({behavior:'smooth',block:'center'});
  }finally{
    btn.disabled=false;
    btn.textContent='Request my booking';
  }
}
