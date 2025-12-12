# EmailJS Setup Guide for Luxe Beauty Haven

This guide will walk you through setting up EmailJS to send confirmation emails to your customers when they book appointments.

## What is EmailJS?

EmailJS is a free service that lets you send emails directly from JavaScript without needing a backend server. The free tier includes **200 emails per month**, which is perfect for getting started.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** (top right)
3. Create your account (you can use Google sign-in for convenience)
4. Verify your email address

## Step 2: Add Email Service

1. After logging in, go to **Email Services** in the left sidebar
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Yahoo**
   - Or any other supported service
4. Click **Connect Account** and follow the authorization flow
5. Give your service a name (e.g., "Luxe Beauty Haven Notifications")
6. Click **Create Service**
7. **IMPORTANT:** Copy your **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in the left sidebar
2. Click **Create New Template**
3. Give it a name: "Appointment Confirmation"
4. In the template editor, paste this HTML template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <h1 style="color: #333; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">{{salon_name}}</h1>
    
    <h2 style="color: #555;">✅ Appointment Confirmed!</h2>
    
    <p>Dear <strong>{{customer_name}}</strong>,</p>
    
    <p>Thank you for booking with us! Your appointment has been successfully confirmed.</p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">📋 Appointment Details</h3>
      <p><strong>Booking Reference:</strong> {{booking_reference}}</p>
      <p><strong>Date:</strong> {{appointment_date}}</p>
      <p><strong>Time:</strong> {{appointment_time}}</p>
      <p><strong>Service(s):</strong> {{services}}</p>
    </div>
    
    <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0;"><strong>⚠️ Important:</strong> Please arrive 5-10 minutes early for your appointment.</p>
      <p style="margin: 10px 0 0 0;"><strong>💰 Deposit:</strong> Remember, a R50 deposit is required to confirm your booking.</p>
    </div>
    
    <h3 style="color: #333;">📞 Contact Information</h3>
    <p><strong>Phone:</strong> {{salon_phone}}</p>
    <p><strong>Address:</strong> {{salon_address}}</p>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      Need to reschedule or cancel? Please contact us at least 24 hours in advance.
    </p>
    
    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      © 2025 {{salon_name}}. All rights reserved.
    </p>
  </div>
</div>
```

5. Make sure the **To Email** field is set to: `{{customer_email}}`
6. Set the **From Name** to: `Luxe Beauty Haven`
7. Set the **Subject** to: `Appointment Confirmed - {{appointment_date}}`
8. Click **Save**
9. **IMPORTANT:** Copy your **Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **Account** in the left sidebar
2. Look for **API Keys** section
3. You'll see your **Public Key** displayed
4. **IMPORTANT:** Copy your **Public Key**

## Step 5: Update Your Website Code

Now you have all three pieces of information you need:
- ✅ Public Key
- ✅ Service ID
- ✅ Template ID

1. Open `main.js` in your project
2. Find the `EMAILJS_CONFIG` section at the top (around line 8)
3. Replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',      // ← Replace with your actual Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID_HERE',      // ← Replace with your actual Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE'     // ← Replace with your actual Template ID
};
```

4. **Optional:** Update the salon contact information (lines 124-125):
   - Replace `'+27 XX XXX XXXX'` with your actual phone number
   - Replace `'Your Salon Address Here'` with your actual address

5. Save the file

## Step 6: Test Your Setup

1. Open your website: `http://localhost:8000`
2. Scroll to the booking form
3. Fill in the form with:
   - Your name
   - **YOUR REAL EMAIL ADDRESS** (so you can receive the test email)
   - Phone number
   - Select a date and time
   - Choose at least one service
4. Click **Book Appointment**
5. You should see a success message saying "A confirmation email has been sent to [your email]"
6. Check your inbox (and spam folder) for the confirmation email

## Troubleshooting

### "Email notifications not yet configured" message

**Problem:** You see this message after booking.

**Solution:** Make sure you replaced all three placeholder values in `EMAILJS_CONFIG` with your actual EmailJS credentials.

### Email not arriving

**Problem:** Booking succeeds but no email arrives.

**Solutions:**
1. Check your spam/junk folder
2. Verify the email address in the booking form was typed correctly
3. Check EmailJS dashboard (Email Logs section) to see if the email was sent
4. Make sure your email service is properly connected in EmailJS dashboard
5. Check browser console (F12) for any error messages

### "Failed to send email" error

**Problem:** You see an error in the console.

**Solutions:**
1. Verify your Public Key, Service ID, and Template ID are correct
2. Check that your EmailJS email service is still connected
3. Make sure you haven't exceeded the 200 emails/month free tier limit
4. Check the browser console for specific error details

### Template variables not showing

**Problem:** Email arrives but shows `{{variable_name}}` instead of actual values.

**Solution:** Make sure the variable names in your EmailJS template exactly match the ones in the code:
- `customer_name`
- `customer_email`
- `services`
- `appointment_date`
- `appointment_time`
- `booking_reference`
- `salon_name`
- `salon_phone`
- `salon_address`

## Important Notes

### Free Tier Limits
- 200 emails per month
- 2 email templates
- 1 email service

If you need more, you can upgrade to a paid plan.

### Security
- Your Public Key is safe to use in client-side code
- **Never** use your Private Key in client-side code
- EmailJS Public Keys are designed to be exposed in browsers

### Booking Still Works Without Email
Even if email sending fails, the appointment will still be saved to your browser's localStorage. Customers just won't receive a confirmation email.

## Next Steps

Once email confirmations are working, you might want to:
1. **Add admin notifications** - Get an email when someone books
2. **Create reminder emails** - Send reminders 24 hours before appointments
3. **Add cancellation emails** - Notify customers when appointments are cancelled

These would require setting up additional EmailJS templates and potentially using a backend server or scheduling service for automated notifications.

---

**Need Help?**
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
