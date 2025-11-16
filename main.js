import {supabase} from './supabaseClient.js';

async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    console.error('Error fetching services:', error);
  } else {
    console.log('Services:', data);
  }
}

fetchServices();
