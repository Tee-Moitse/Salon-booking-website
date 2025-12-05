# Supabase Setup Guide for Luxe Beauty Haven

This guide will walk you through setting up Supabase for your salon booking website.

## Prerequisites

- A Supabase account (free tier is fine)
- Your Supabase project already created (you have this!)
- Your project URL and anon key (already in `supabaseClient.js`)

## Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `tdyvxqdjlxkrswsokehu`

## Step 2: Create Database Tables

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

You should see a success message. This script will:
- Create 3 tables: `services`, `staff`, and `appointments`
- Insert sample data for services and staff
- Set up Row Level Security (RLS) policies
- Create database indexes for performance

## Step 3: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should see three tables:
   - **services** - Contains Hair, Nails, Lashes, Make up
   - **staff** - Contains 4 staff members
   - **appointments** - Empty (will fill up when customers book)

## Step 4: Test Your Website

1. Open `index.html` in your browser (or use a local server)
2. Scroll down to the booking form
3. You should see services loaded dynamically from Supabase
4. Fill out the form and submit a test booking
5. Check the **appointments** table in Supabase to see your booking

## Step 5: View Appointments in Supabase

1. Go to **Table Editor** > **appointments**
2. You'll see all bookings with:
   - Customer name and phone
   - Selected service
   - Assigned staff member
   - Appointment date/time
   - Status (pending by default)

## Troubleshooting

### Services Not Loading

**Problem:** Services don't appear in the booking form

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check that the SQL script ran successfully
4. Verify your Supabase URL and key in `supabaseClient.js`

### Booking Fails

**Problem:** Form submission doesn't work

**Solution:**
1. Check browser console for errors
2. Verify RLS policies are enabled (they should be from the SQL script)
3. Make sure all required fields are filled
4. Check that services and staff exist in the database

### CORS Errors

**Problem:** Browser shows CORS policy errors

**Solution:**
1. Make sure you're using `type="module"` in the script tag (already done)
2. Use a local server instead of opening HTML directly:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
3. Then open `http://localhost:8000` in your browser

### Module Import Errors

**Problem:** "Cannot use import statement outside a module"

**Solution:**
- Make sure `index.html` has `<script type="module" src="main.js"></script>` (already fixed)
- Serve the files through a local server (see CORS solution above)

## Database Schema Reference

### services table
```sql
- id (UUID) - Primary key
- name (TEXT) - Service name
- price (NUMERIC) - Service price
- description (TEXT) - Optional description
- created_at (TIMESTAMP) - Auto-generated
```

### staff table
```sql
- id (UUID) - Primary key
- name (TEXT) - Staff member name
- specialization (TEXT) - What they specialize in
- created_at (TIMESTAMP) - Auto-generated
```

### appointments table
```sql
- id (UUID) - Primary key
- customer_name (TEXT) - Customer's full name
- customer_phone (TEXT) - Customer's phone number
- customer_email (TEXT) - Customer's email (optional)
- service_id (UUID) - Links to services table
- staff_id (UUID) - Links to staff table
- appointment_time (TIMESTAMP) - When the appointment is
- status (TEXT) - 'pending', 'confirmed', 'completed', 'cancelled'
- created_at (TIMESTAMP) - When booking was made
```

## Next Steps

### Add More Services

1. Go to **Table Editor** > **services**
2. Click **Insert** > **Insert row**
3. Fill in name, price, and description
4. Click **Save**

### Add More Staff

1. Go to **Table Editor** > **staff**
2. Click **Insert** > **Insert row**
3. Fill in name and specialization
4. Click **Save**

### Manage Appointments

You can view, edit, or delete appointments directly in the Supabase dashboard:
1. Go to **Table Editor** > **appointments**
2. Click on any row to edit
3. Update the status field to track appointment progress

### Enable Email Notifications (Advanced)

To send confirmation emails when appointments are booked:
1. Use Supabase Edge Functions
2. Set up a database trigger
3. Integrate with an email service (SendGrid, Mailgun, etc.)

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Public can read services and staff (needed for the website)
- ✅ Public can insert appointments (needed for bookings)
- ✅ Public can read appointments (you may want to disable this later)
- ⚠️ Consider adding authentication if you want an admin panel
- ⚠️ Never commit your service role key to Git (anon key is fine)

## Support

If you run into issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Review the [Supabase documentation](https://supabase.com/docs)
4. Ask for help with specific error messages

---

**Your Supabase is now ready! 🎉**

Your salon booking website should now be fully functional with a complete backend.
