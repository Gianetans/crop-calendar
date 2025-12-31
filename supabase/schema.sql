-- Crop Calendar Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  last_frost_date DATE NOT NULL,
  first_frost_date DATE,
  hardiness_zone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table (pre-loaded data)
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  category TEXT NOT NULL,
  days_to_maturity INTEGER NOT NULL,
  frost_tolerance TEXT NOT NULL,
  planting_depth TEXT,
  spacing TEXT,
  soil_temp_min INTEGER,
  indoor_start_weeks INTEGER,
  transplant_weeks INTEGER,
  direct_sow_weeks_before_frost INTEGER,
  direct_sow_weeks_after_frost INTEGER,
  succession_planting_weeks INTEGER,
  companion_plants TEXT[],
  avoid_plants TEXT[],
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User's garden crops table
CREATE TABLE IF NOT EXISTS public.user_crops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  planned_plant_date DATE,
  actual_plant_date DATE,
  estimated_harvest_date DATE,
  status TEXT DEFAULT 'planned',
  quantity TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, crop_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crops ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for crops (public read)
CREATE POLICY "Anyone can view crops"
  ON public.crops FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_crops
CREATE POLICY "Users can view their own crops"
  ON public.user_crops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crops"
  ON public.user_crops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crops"
  ON public.user_crops FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crops"
  ON public.user_crops FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_crops_user_id ON public.user_crops(user_id);
CREATE INDEX IF NOT EXISTS idx_user_crops_crop_id ON public.user_crops(crop_id);
CREATE INDEX IF NOT EXISTS idx_crops_category ON public.crops(category);
CREATE INDEX IF NOT EXISTS idx_crops_name ON public.crops(name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE
    ON public.user_profiles FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
