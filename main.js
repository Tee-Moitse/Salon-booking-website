
import { supabase } from './supabaseClient.js';

const bookingForm = document.getElementById('booking-form');
const servicesContainer = document.getElementById('services-container');

// Dynamically load services from Supabase
async function loadServices() {
  const { data, error } = await supabase.from('services').select('*');

  if (error) {
    console.error('Error fetching services:', error);
    servicesContainer.textContent = 'Failed to load services';
    return;
  }

  data.forEach(service => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'services';
    checkbox.value = service.name;
    label.appendChild(checkbox);
    label.append(` ${service.name} - R${service.price}`);
    servicesContainer.appendChild(label);
    servicesContainer.appendChild(document.createElement('br'));
  });
}

loadServices();

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value; // optional
  const phone = document.getElementById('phone').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                                .map(cb => cb.value);

  if (selectedServices.length === 0) {
    alert('Please select at least one service.');
    return;
  }

  // Combine date + time into ISO timestamp
  const appointment_time = new Date(`${date}T${time}:00`).toISOString();

  // Insert each selected service as a separate appointment
  for (let serviceName of selectedServices) {
    // Get service id
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('id')
      .eq('name', serviceName)
      .single();

    if (serviceError || !serviceData) {
      console.error('Service not found:', serviceName, serviceError);
      continue;
    }
    const service_id = serviceData.id;

    // Get a default staff (for now)
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('id')
      .limit(1)
      .single();

    if (staffError || !staffData) {
      console.error('No staff available', staffError);
      continue;
    }
    const staff_id = staffData.id;

    // Insert appointment
    const { error: insertError } = await supabase.from('appointments').insert([
      {
        customer_name: name,
        customer_phone: phone,
        service_id,
        staff_id,
        appointment_time
      }
    ]);

    if (insertError) {
      console.error(`Failed to book ${serviceName}:`, insertError);
      alert(`Failed to book ${serviceName}.`);
    }
  }

  alert('Appointment(s) successfully booked!');
  bookingForm.reset();
});


function showNotification(message, success = true) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.backgroundColor = success ? '#4CAF50' : '#f44336'; // green for success, red for error
  notification.style.display = 'block';
  
  // Hide after 4 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 4000);
}



//Booking form
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent page refresh

  // Collect form values
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const services = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                        .map(cb => cb.value);

  if (services.length === 0) {
    showNotification('Please select at least one service', false);
    return;
  }

  const appointment_time = new Date(`${date}T${time}:00`).toISOString();

  try {
    for (let serviceName of services) {
      const { data: serviceData } = await supabase
        .from('services')
        .select('id')
        .eq('name', serviceName)
        .single();

      const service_id = serviceData.id;

      const { data: staffData } = await supabase
        .from('staff')
        .select('id')
        .limit(1)
        .single();

      const staff_id = staffData.id;

      const { error } = await supabase.from('appointments').insert([
        {
          customer_name: name,
          customer_phone: phone,
          service_id,
          staff_id,
          appointment_time
        }
      ]);

      if (error) throw error;
    }

    // Show success notification
    showNotification('Appointment(s) successfully booked!');
    bookingForm.reset();

  } catch (err) {
    console.error('Booking error:', err);
    showNotification('Failed to book appointment', false);
  }
});
