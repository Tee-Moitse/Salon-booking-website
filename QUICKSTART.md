# Quick Start Guide - Supabase Backend

## 🚀 Your Backend is Ready!

Your salon booking website now has a fully functional Supabase backend. Here's what you need to do to get it running:

## ⚡ Quick Setup (5 minutes)

### 1. Run the SQL Script

1. Go to https://supabase.com and sign in
2. Open your project dashboard
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase-setup.sql` in your project
6. Copy ALL the content and paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

✅ You should see "Success. No rows returned"

### 2. Verify Tables

1. Click **Table Editor** in the left sidebar
2. You should see 3 tables:
   - **services** - Should have 4 rows (Hair, Nails, Lashes, Make up)
   - **staff** - Should have 4 rows (staff members)
   - **appointments** - Should be empty (will fill up when customers book)

### 3. Test Your Website

```bash
# Start a local server
cd "/home/wtc_/GitHub projects/LBH/Salon-booking-website"
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser

### 4. Make a Test Booking

1. Scroll to the booking form
2. Fill in your details
3. Select some services
4. Click "Book Appointment"
5. You should see a green success message!

### 5. Check the Database

1. Go back to Supabase
2. Click **Table Editor** > **appointments**
3. You should see your test booking!

---

## 📁 Files Overview

| File | What It Does |
|------|--------------|
| `supabase-setup.sql` | Creates all database tables and sample data |
| `SUPABASE_SETUP.md` | Detailed setup guide with troubleshooting |
| `supabaseClient.js` | Connects your website to Supabase |
| `main.js` | Handles form submission and bookings |
| `index.html` | Your website (updated to support modules) |

---

## 🎯 What Works Now

✅ Services load automatically from database  
✅ Customers can book appointments  
✅ Bookings are saved to Supabase  
✅ Success/error notifications  
✅ Email field is captured (optional)  
✅ Multiple services can be booked at once  

---

## 🔧 Common Issues

**Services not showing?**
- Run the SQL script in Supabase first
- Check browser console (F12) for errors

**"Cannot use import statement outside a module"?**
- Use a local server (python3 -m http.server 8000)
- Don't open the HTML file directly

**Booking not working?**
- Make sure you ran the SQL script
- Check that services and staff exist in database
- Look at browser console for error messages

---

## 📚 Need More Help?

- Read `SUPABASE_SETUP.md` for detailed instructions
- Read `walkthrough.md` to see what was done
- Check browser console (F12) for error messages
- Check Supabase logs in the dashboard

---

## 🎨 Next Steps

Once everything is working, you can:

1. **Customize Services**
   - Go to Supabase > Table Editor > services
   - Add, edit, or remove services
   - Changes appear immediately on your website!

2. **Add More Staff**
   - Go to Supabase > Table Editor > staff
   - Add new staff members

3. **View Bookings**
   - Go to Supabase > Table Editor > appointments
   - See all customer bookings
   - Update status (pending → confirmed → completed)

4. **Deploy Your Website**
   - Use Netlify, Vercel, or GitHub Pages
   - Your Supabase backend works from anywhere!

---

**That's it! Your salon booking website is ready to go! 🎉**
