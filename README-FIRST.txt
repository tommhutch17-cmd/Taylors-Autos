TAYLOR'S AUTOS — SIMPLE DEPLOYMENT STEPS

This version stays on GitHub + Netlify + Supabase. There is no Vite, npm or package install.

1. IMPORTANT: Secure Supabase first
   - Sign in to Supabase.
   - Open your Taylor's Autos project.
   - Click SQL Editor.
   - Click New query.
   - Open the file: supabase/setup.sql
   - Copy all of it into Supabase and click Run.

2. Create/confirm the staff login
   - Supabase > Authentication > Users.
   - Create a staff user with an email and password if one does not already exist.
   - The staff member logs in at /staff.html.

3. Replace the files in GitHub
   - Open your Taylor's Autos GitHub repository.
   - Delete the old index.html and old site files, or upload this whole folder's CONTENTS over them.
   - The root of the repository must contain index.html, book.html, track.html, staff.html, privacy.html and netlify.toml.
   - Also upload the assets and supabase folders.
   - Commit the changes.

4. Netlify
   - If Netlify is connected to the GitHub repository, it should redeploy automatically.
   - No build command is required.
   - Publish directory should be left blank or set to the repository root.

5. Test in this order
   - Open /book.html and submit a test request.
   - Save the tracking number shown.
   - Open /track.html and enter the tracking number plus the same mobile.
   - Open /staff.html and log in.
   - Change the status and prices.
   - Return to /track.html and check the updated customer view.

NOT YET INCLUDED
- Automatic email/SMS notifications.
- Customer approval buttons.
- Image uploads and invoices.
These can be added after this secure base is confirmed working.

SECURITY NOTE
The Supabase anon key in assets/js/config.js is a public browser key, not the service-role secret. Never put a Supabase service-role key in GitHub or frontend code.

LATEST BOOKING FIX
------------------
This version includes a safer booking submission check. If Supabase reports an
error after a booking has actually been saved, the page verifies the new job
through the secure tracking function before showing a failure message. This
prevents customers submitting duplicate requests.
