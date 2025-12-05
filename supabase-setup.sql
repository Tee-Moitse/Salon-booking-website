-- ============================================
-- Luxe Beauty Haven - Supabase Database Setup
-- ============================================
-- Run this script in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste this script > Run

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. INSERT SAMPLE DATA
-- ============================================

-- Insert Services (based on your project_scope file)
INSERT INTO services (name, price, description) VALUES
    ('Hair', 350.00, 'Professional hair styling and treatments'),
    ('Nails', 200.00, 'Manicure and nail art services'),
    ('Lashes', 225.00, 'Eyelash extensions and treatments'),
    ('Make up', 300.00, 'Professional makeup application');

-- Insert Sample Staff Members
INSERT INTO staff (name, specialization) VALUES
    ('Thandi Mokoena', 'Hair Specialist'),
    ('Lerato Dlamini', 'Nail Technician'),
    ('Nomsa Khumalo', 'Lash Technician'),
    ('Zanele Nkosi', 'Makeup Artist');

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Services: Allow public read access
CREATE POLICY "Allow public read access to services"
    ON services FOR SELECT
    USING (true);

-- Staff: Allow public read access
CREATE POLICY "Allow public read access to staff"
    ON staff FOR SELECT
    USING (true);

-- Appointments: Allow public insert (for booking)
CREATE POLICY "Allow public insert to appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

-- Appointments: Allow public read (optional - remove if you want privacy)
CREATE POLICY "Allow public read access to appointments"
    ON appointments FOR SELECT
    USING (true);

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now verify the tables in the Table Editor
-- and test your booking form on the website.
