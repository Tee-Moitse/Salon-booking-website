// ============================================
// EMAILJS CONFIGURATION
// ============================================
// IMPORTANT: Replace these with your actual EmailJS credentials
// Get them from: https://dashboard.emailjs.com/
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',      // Replace with your EmailJS public key
  SERVICE_ID: 'YOUR_SERVICE_ID_HERE',      // Replace with your EmailJS service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE'     // Replace with your EmailJS template ID
};

// Initialize EmailJS (only if keys are configured)
if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

const bookingForm = document.getElementById('booking-form');

// Show notification to user
function showNotification(message, success = true) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.backgroundColor = success ? '#4CAF50' : '#f44336';
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 4000);
}

// ============================================
// EMAIL CONFIRMATION FUNCTION
// ============================================
async function sendConfirmationEmail(bookingDetails) {
  // Skip if EmailJS is not configured
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
    console.log('EmailJS not configured. Skipping email notification.');
    return { success: false, reason: 'not_configured' };
  }

  // Skip if customer didn't provide email
  if (!bookingDetails.email) {
    console.log('No email provided by customer. Skipping email notification.');
    return { success: false, reason: 'no_email' };
  }

  try {
    // Format the services list
    const servicesList = bookingDetails.services.join(', ');

    // Format date and time nicely
    const appointmentDate = new Date(bookingDetails.appointment_time);
    const formattedDate = appointmentDate.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Email template parameters
    const templateParams = {
      customer_name: bookingDetails.name,
      customer_email: bookingDetails.email,
      customer_phone: bookingDetails.phone,
      services: servicesList,
      appointment_date: formattedDate,
      appointment_time: formattedTime,
      booking_reference: bookingDetails.bookingId || 'TBD',
      salon_name: 'Luxe Beauty Haven',
      salon_phone: '+27 XX XXX XXXX',  // Replace with actual salon phone
      salon_address: 'Your Salon Address Here'  // Replace with actual address
    };

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };

  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  // Get selected services
  const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
    .map(cb => cb.value);

  // Validation
  if (selectedServices.length === 0) {
    showNotification('Please select at least one service', false);
    return;
  }

  if (!name || !phone || !date || !time) {
    showNotification('Please fill in all required fields', false);
    return;
  }

  // Combine date + time into ISO timestamp
  const appointment_time = new Date(`${date}T${time}:00`).toISOString();

  try {
    // Create booking details for email and local storage
    const bookingDetails = {
      name,
      email,
      phone,
      services: selectedServices,
      appointment_time,
      bookingId: `LBH-${Date.now()}`,  // Simple booking reference
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(bookingDetails);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(bookingDetails);

    // Show success message with email status
    let successMessage = `✅ Successfully booked ${selectedServices.length} service(s)!`;

    if (emailResult.success) {
      successMessage += ` A confirmation email has been sent to ${email}.`;
    } else if (emailResult.reason === 'no_email') {
      successMessage += ` (No email provided for confirmation)`;
    } else if (emailResult.reason === 'not_configured') {
      successMessage += ` (Email notifications not yet configured)`;
    } else {
      successMessage += ` (Note: Confirmation email failed to send, but your booking is confirmed)`;
    }

    showNotification(successMessage, true);

    // Log booking details to console for reference
    console.log('Booking saved:', bookingDetails);

    bookingForm.reset();

  } catch (err) {
    console.error('Booking error:', err);
    showNotification('An error occurred. Please try again.', false);
  }
});
