-- ========================================================
-- KM Chit Fund - Database Schema Setup
-- Run this in your Supabase SQL Editor to set up the tables
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    company_logo TEXT, -- Base64 encoded or public URL
    company_address TEXT,
    company_mobile TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    address TEXT,
    chit_amount NUMERIC NOT NULL DEFAULT 0,
    total_paid NUMERIC NOT NULL DEFAULT 0,
    pending_amount NUMERIC NOT NULL DEFAULT 0,
    interest_amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT REFERENCES members(member_id) ON DELETE CASCADE,
    amount_paid NUMERIC NOT NULL DEFAULT 0,
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('Cash', 'QR Payment')),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gift Items Table
CREATE TABLE IF NOT EXISTS gift_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    item_image TEXT, -- Base64 encoded or public URL
    item_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. QR Settings Table
CREATE TABLE IF NOT EXISTS qr_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_image TEXT, -- Base64 encoded or public URL
    upi_id TEXT,
    qr_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================
-- Row Level Security (RLS) & Policies
-- Enabled for future authentication compliance.
-- For Phase 1, we allow public (anonymous) read & write access.
-- In Phase 2, you can restrict policies to authenticated users.
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_settings ENABLE ROW LEVEL SECURITY;

-- App Settings Policies
CREATE POLICY "Allow public read app_settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert app_settings" ON app_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update app_settings" ON app_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete app_settings" ON app_settings FOR DELETE USING (true);

-- Members Policies
CREATE POLICY "Allow public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update members" ON members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete members" ON members FOR DELETE USING (true);

-- Payments Policies
CREATE POLICY "Allow public read payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update payments" ON payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete payments" ON payments FOR DELETE USING (true);

-- Gift Items Policies
CREATE POLICY "Allow public read gift_items" ON gift_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert gift_items" ON gift_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update gift_items" ON gift_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete gift_items" ON gift_items FOR DELETE USING (true);

-- QR Settings Policies
CREATE POLICY "Allow public read qr_settings" ON qr_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert qr_settings" ON qr_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update qr_settings" ON qr_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete qr_settings" ON qr_settings FOR DELETE USING (true);
