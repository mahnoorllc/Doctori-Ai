-- Create role enums
CREATE TYPE public.user_role AS ENUM ('user', 'provider', 'admin');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Update profiles table with new schema
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS role CASCADE,
ADD COLUMN role public.user_role DEFAULT 'user'::public.user_role,
ADD COLUMN approval_status public.approval_status DEFAULT 'pending'::public.approval_status,
DROP COLUMN IF EXISTS name CASCADE,
ADD COLUMN name text,
DROP COLUMN IF EXISTS age CASCADE,
ADD COLUMN age integer,
DROP COLUMN IF EXISTS gender CASCADE,
ADD COLUMN gender public.gender_type,
ADD COLUMN photo_url text,
ADD COLUMN bio text,
ADD COLUMN weight numeric,
ADD COLUMN height numeric,
ADD COLUMN blood_group public.blood_group_type,
ADD COLUMN health_info jsonb DEFAULT '{}'::jsonb;

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  reminder_time timestamptz NOT NULL,
  repeat_interval text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create provider_patient_assignments table
CREATE TABLE IF NOT EXISTS public.provider_patient_assignments (
  id bigserial PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, patient_id)
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id bigserial PRIMARY KEY,
  actor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_patient_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create comprehensive RLS policies for profiles
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS policies for reminders
CREATE POLICY "Users can CRUD their own reminders" ON public.reminders
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reminders" ON public.reminders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS policies for provider_patient_assignments
CREATE POLICY "Providers can view their assignments" ON public.provider_patient_assignments
FOR SELECT USING (
  auth.uid() = provider_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'provider' AND approval_status = 'approved'
  )
);

CREATE POLICY "Patients can view their assignments" ON public.provider_patient_assignments
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Admins can manage all assignments" ON public.provider_patient_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS policies for activity_logs
CREATE POLICY "Admins can view activity logs" ON public.activity_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can insert activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('provider-docs', 'provider-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars (public read, owner write)
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for provider documents
CREATE POLICY "Providers can access their own documents" ON storage.objects
FOR ALL USING (
  bucket_id = 'provider-docs' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'provider'
  )
);

CREATE POLICY "Admins can view all provider documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'provider-docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create helper functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_approval_status()
RETURNS public.approval_status
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT approval_status FROM public.profiles WHERE id = auth.uid();
$$;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'user')
  );
  RETURN NEW;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider ON public.provider_patient_assignments(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_patient ON public.provider_patient_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);