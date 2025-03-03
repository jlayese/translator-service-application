/*
  # Initial Schema for TranslateNow

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `user_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `languages`
      - `id` (uuid, primary key)
      - `code` (text)
      - `name` (text)
      - `created_at` (timestamptz)
    
    - `translator_profiles`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `bio` (text)
      - `hourly_rate` (numeric)
      - `is_available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `translator_languages`
      - `id` (uuid, primary key)
      - `translator_id` (uuid, references translator_profiles)
      - `language_id` (uuid, references languages)
      - `proficiency_level` (text)
      - `created_at` (timestamptz)
    
    - `translation_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `request_type` (text)
      - `source_language_id` (uuid, references languages)
      - `target_language_id` (uuid, references languages)
      - `scheduled_date` (timestamptz)
      - `duration_hours` (numeric)
      - `location_type` (text)
      - `location_details` (text)
      - `budget` (numeric)
      - `status` (text)
      - `document_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `translation_assignments`
      - `id` (uuid, primary key)
      - `request_id` (uuid, references translation_requests)
      - `translator_id` (uuid, references translator_profiles)
      - `status` (text)
      - `accepted_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `client_rating` (integer)
      - `translator_rating` (integer)
      - `client_review` (text)
      - `translator_review` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for translators to view available requests
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text,
  avatar_url text,
  user_type text NOT NULL CHECK (user_type IN ('client', 'translator')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Create translator profiles table
CREATE TABLE IF NOT EXISTS translator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  bio text,
  hourly_rate numeric,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

ALTER TABLE translator_profiles ENABLE ROW LEVEL SECURITY;

-- Create translator languages table
CREATE TABLE IF NOT EXISTS translator_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  translator_id uuid REFERENCES translator_profiles NOT NULL,
  language_id uuid REFERENCES languages NOT NULL,
  proficiency_level text CHECK (proficiency_level IN ('basic', 'conversational', 'fluent', 'native')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(translator_id, language_id)
);

ALTER TABLE translator_languages ENABLE ROW LEVEL SECURITY;

-- Create translation requests table
CREATE TABLE IF NOT EXISTS translation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles NOT NULL,
  title text NOT NULL,
  description text,
  request_type text NOT NULL CHECK (request_type IN ('live', 'document')),
  source_language_id uuid REFERENCES languages NOT NULL,
  target_language_id uuid REFERENCES languages NOT NULL,
  scheduled_date timestamptz,
  duration_hours numeric,
  location_type text,
  location_details text,
  budget numeric,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  document_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- Create translation assignments table
CREATE TABLE IF NOT EXISTS translation_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES translation_requests NOT NULL,
  translator_id uuid REFERENCES translator_profiles NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  accepted_at timestamptz,
  completed_at timestamptz,
  client_rating integer CHECK (client_rating BETWEEN 1 AND 5),
  translator_rating integer CHECK (translator_rating BETWEEN 1 AND 5),
  client_review text,
  translator_review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(request_id, translator_id)
);

ALTER TABLE translation_assignments ENABLE ROW LEVEL SECURITY;

-- Insert default languages
INSERT INTO languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Spanish'),
  ('fr', 'French'),
  ('de', 'German'),
  ('zh', 'Mandarin'),
  ('ja', 'Japanese'),
  ('ko', 'Korean'),
  ('ar', 'Arabic'),
  ('ru', 'Russian'),
  ('pt', 'Portuguese'),
  ('it', 'Italian'),
  ('nl', 'Dutch'),
  ('hi', 'Hindi'),
  ('vi', 'Vietnamese'),
  ('tr', 'Turkish')
ON CONFLICT (code) DO NOTHING;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Languages policies (readable by all authenticated users)
CREATE POLICY "Languages are viewable by all authenticated users"
  ON languages
  FOR SELECT
  TO authenticated
  USING (true);

-- Translator profiles policies
CREATE POLICY "Translators can view their own profile"
  ON translator_profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = translator_profiles.profile_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can update their own profile"
  ON translator_profiles
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = translator_profiles.profile_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can insert their own profile"
  ON translator_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = translator_profiles.profile_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Clients can view translator profiles"
  ON translator_profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.user_type = 'client'
  ));

-- Translator languages policies
CREATE POLICY "Translators can manage their own languages"
  ON translator_languages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM translator_profiles
    JOIN profiles ON profiles.id = translator_profiles.profile_id
    WHERE translator_profiles.id = translator_languages.translator_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Users can view translator languages"
  ON translator_languages
  FOR SELECT
  TO authenticated
  USING (true);

-- Translation requests policies
CREATE POLICY "Clients can manage their own requests"
  ON translation_requests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = translation_requests.client_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can view available requests"
  ON translation_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.user_type = 'translator'
    )
    AND
    status = 'pending'
  );

-- Translation assignments policies
CREATE POLICY "Clients can view assignments for their requests"
  ON translation_assignments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM translation_requests
    JOIN profiles ON profiles.id = translation_requests.client_id
    WHERE translation_requests.id = translation_assignments.request_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can view their assignments"
  ON translation_assignments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM translator_profiles
    JOIN profiles ON profiles.id = translator_profiles.profile_id
    WHERE translator_profiles.id = translation_assignments.translator_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can update their assignments"
  ON translation_assignments
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM translator_profiles
    JOIN profiles ON profiles.id = translator_profiles.profile_id
    WHERE translator_profiles.id = translation_assignments.translator_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Translators can insert assignments"
  ON translation_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM translator_profiles
    JOIN profiles ON profiles.id = translator_profiles.profile_id
    WHERE translator_profiles.id = translation_assignments.translator_id
    AND profiles.user_id = auth.uid()
  ));

-- Functions for handling user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_type');
  
  -- If user is a translator, create translator profile
  IF new.raw_user_meta_data->>'user_type' = 'translator' THEN
    INSERT INTO public.translator_profiles (profile_id)
    VALUES ((SELECT id FROM public.profiles WHERE user_id = new.id));
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();