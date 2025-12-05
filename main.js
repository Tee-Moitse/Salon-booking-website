import { supabase } from './supabaseClient.js';

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
      showNotification(`Successfully booked ${successCount} appointment(s)!`, true);
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
