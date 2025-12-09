import { supabase } from './supabaseClient.js';

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
const servicesContainer = document.getElementById('services-container');

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

// Dynamically load services from Supabase
async function loadServices() {
  try {
    const { data, error } = await supabase.from('services').select('*');

    if (error) {
      console.error('Error fetching services:', error);
      showNotification('Failed to load services. Please refresh the page.', false);
      return;
    }

    // Clear existing content
    servicesContainer.innerHTML = '';

    if (data && data.length > 0) {
      data.forEach(service => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'services';
        checkbox.value = service.name;
        checkbox.dataset.serviceId = service.id;

        label.appendChild(checkbox);
        label.append(` ${service.name} - R${service.price}`);
        servicesContainer.appendChild(label);
        servicesContainer.appendChild(document.createElement('br'));
      });
    } else {
      servicesContainer.innerHTML = '<p>No services available at the moment.</p>';
    }
  } catch (err) {
    console.error('Error loading services:', err);
    showNotification('Failed to load services. Please refresh the page.', false);
  }
}

// Load services when page loads
loadServices();

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
    const servicesList = bookingDetails.services
      .map(s => `${s.name} - R${s.price}`)
      .join(', ');

    // Calculate total price
    const totalPrice = bookingDetails.services.reduce((sum, s) => sum + parseFloat(s.price), 0);

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
      total_price: totalPrice.toFixed(2),
      appointment_date: formattedDate,
      appointment_time: formattedTime,
      staff_name: bookingDetails.staffName || 'Our specialist',
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
    .map(cb => ({
      name: cb.value,
      id: cb.dataset.serviceId
    }));

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
    let successCount = 0;
    let failCount = 0;

    for (let service of selectedServices) {
      // Get a staff member (randomly select one)
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .limit(1)
        .single();

      if (staffError || !staffData) {
        console.error('No staff available', staffError);
        failCount++;
        continue;
      }

      // Insert appointment
      const { error: insertError } = await supabase.from('appointments').insert([
        {
          customer_name: name,
          customer_phone: phone,
          customer_email: email || null,
          service_id: service.id,
          staff_id: staffData.id,
          appointment_time,
          status: 'pending'
        }
      ]);

      if (insertError) {
        console.error(`Failed to book ${service.name}:`, insertError);
        failCount++;
      } else {
        successCount++;
      }
    }

    // Show result
    if (successCount > 0 && failCount === 0) {
      // Create booking details for email
      const bookingDetails = {
        name,
        email,
        phone,
        services: selectedServices.map(s => ({
          name: s.name,
          price: 350.00  // You might want to fetch actual prices from Supabase
        })),
        appointment_time,
        staffName: 'Our specialist',  // Could be fetched from staffData if needed
        bookingId: `LBH-${Date.now()}`  // Simple booking reference
      };

      // Send confirmation email
      const emailResult = await sendConfirmationEmail(bookingDetails);

      // Show success message with email status
      if (emailResult.success) {
        showNotification(
          `✅ Successfully booked ${successCount} appointment(s)! A confirmation email has been sent to ${email}.`,
          true
        );
      } else if (emailResult.reason === 'no_email') {
        showNotification(
          `✅ Successfully booked ${successCount} appointment(s)! (No email provided for confirmation)`,
          true
        );
      } else if (emailResult.reason === 'not_configured') {
        showNotification(
          `✅ Successfully booked ${successCount} appointment(s)! (Email notifications not yet configured)`,
          true
        );
      } else {
        showNotification(
          `✅ Successfully booked ${successCount} appointment(s)! (Note: Confirmation email failed to send, but your booking is confirmed)`,
          true
        );
      }

      bookingForm.reset();
      loadServices(); // Reload services to reset checkboxes
    } else if (successCount > 0 && failCount > 0) {
      showNotification(`Booked ${successCount} appointment(s), but ${failCount} failed`, false);
    } else {
      showNotification('Failed to book appointments. Please try again.', false);
    }

  } catch (err) {
    console.error('Booking error:', err);
    showNotification('An error occurred. Please try again.', false);
  }
});
