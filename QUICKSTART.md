# Quick Start Guide - Luxe Beauty Haven

## 🚀 Your Salon Booking Website

Your salon booking website is ready to use! Here's how to get started:

## ⚡ Quick Setup (2 minutes)

### 1. Start a Local Server

```bash
# Navigate to your project directory
cd "c:\Users\Tetlanyo\Documents\GitHub\Luxe Beauty Haven\Salon-booking-website"

# Start a local server (choose one):
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (if you have npm installed)
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser

### 2. Test Your Website

1. Scroll to the booking form
2. Fill in your details
3. Select some services
4. Click "Book Appointment"
5. You should see a green success message!

---

## 📁 Files Overview

| File | What It Does |
|------|--------------|
| `main.js` | Handles form submission and bookings |
| `index.html` | Your website |
| `styles.css` | Website styling |
| `email-setup-guide.md` | Instructions for setting up email notifications |

---

## 🎯 What Works Now

✅ Customers can book appointments  
✅ Bookings are saved to browser localStorage  
✅ Success/error notifications  
✅ Email field is captured (optional)  
✅ Multiple services can be booked at once  
✅ Service selection via checkboxes  

---

## 💾 How Bookings Are Stored

Currently, bookings are saved to your browser's **localStorage**. This means:
- ✅ Bookings persist across page refreshes
- ✅ No external database needed for testing
- ⚠️ Bookings are only visible on the same browser/device
- ⚠️ Clearing browser data will delete bookings

### Viewing Bookings

You can view all bookings in the browser console:

1. Press F12 to open Developer Tools
2. Go to the **Console** tab
3. Type: `JSON.parse(localStorage.getItem('bookings'))`
4. Press Enter to see all bookings

---

## 📧 Email Notifications (Optional)

To enable automatic confirmation emails:

1. Read `email-setup-guide.md` for detailed instructions
2. Sign up for a free EmailJS account
3. Update the credentials in `main.js`
4. Configure your email template

Without EmailJS configured, bookings will still work - customers just won't receive confirmation emails.

---

## 🔧 Common Issues

**"Cannot use import statement outside a module"?**
- Use a local server (see Step 1)
- Don't open the HTML file directly by double-clicking

**Form not submitting?**
- Check browser console (F12) for error messages
- Make sure all required fields are filled
- Ensure at least one service is selected

**Want to clear all test bookings?**
- Open browser console (F12)
- Type: `localStorage.clear()`
- Press Enter

---

## 🎨 Next Steps

Once everything is working, you can:

1. **Set Up Email Notifications**
   - Follow the guide in `email-setup-guide.md`
   - Get automatic confirmation emails for customers

2. **Customize Services**
   - Edit `index.html` (around line 108-126)
   - Add, edit, or remove service checkboxes

3. **Add a Backend (Optional)**
   - Consider using:
     - Firebase (Google's backend service)
     - MongoDB + Express
     - Your own custom backend
   - This will allow you to manage bookings from any device

4. **Deploy Your Website**
   - Use Netlify, Vercel, or GitHub Pages
   - Your website will be live on the internet!
   - Note: localStorage bookings won't sync across deployments

---

## 🛠️ Future Enhancements You Could Add

- Admin dashboard to view/manage bookings
- Calendar integration
- SMS notifications
- Payment processing integration
- Customer login/account system
- Booking availability checker

---

**That's it! Your salon booking website is ready to go! 🎉**
