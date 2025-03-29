
-- This is a SQL script to set up tables in Supabase
-- Run this in the Supabase SQL editor to create the necessary tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  display_name VARCHAR,
  role VARCHAR,
  company VARCHAR,
  industry VARCHAR,
  email_verified BOOLEAN DEFAULT FALSE,
  otp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  company_name VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  job_type VARCHAR NOT NULL,
  salary VARCHAR,
  category VARCHAR NOT NULL,
  description TEXT NOT NULL,
  experience_level VARCHAR,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  posted_by VARCHAR NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  user_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone_number VARCHAR,
  cover_letter TEXT,
  resume VARCHAR,
  job_title VARCHAR NOT NULL,
  company_name VARCHAR NOT NULL,
  location VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  otp VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE
);

-- Create employer profiles table
CREATE TABLE IF NOT EXISTS employer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  email VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  industry VARCHAR NOT NULL,
  position VARCHAR,
  phone VARCHAR,
  website VARCHAR,
  description TEXT,
  location VARCHAR,
  company_size VARCHAR,
  founded_year INTEGER,
  logo VARCHAR,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidate profiles table
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  email VARCHAR NOT NULL,
  skills VARCHAR[],
  experience TEXT,
  education TEXT,
  resume VARCHAR,
  phone VARCHAR,
  location VARCHAR,
  bio TEXT,
  portfolio VARCHAR,
  linkedin VARCHAR,
  github VARCHAR,
  preferred_job_types VARCHAR[],
  preferred_locations VARCHAR[],
  preferred_categories VARCHAR[],
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for jobs)
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (active = true);

-- Other tables should have appropriate policies based on your app's requirements
-- These are just examples and should be adjusted based on your specific needs
