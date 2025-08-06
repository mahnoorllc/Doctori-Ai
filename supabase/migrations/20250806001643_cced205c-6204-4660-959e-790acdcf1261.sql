-- Update profiles table to include role and additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'admin')),
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Create chats table for structured chat answers
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  age INTEGER,
  gender TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chats table
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Create policies for chats table
CREATE POLICY "Users can create their own chats" 
ON public.chats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chats" 
ON public.chats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" 
ON public.chats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats"
ON public.chats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Update doctors table to include additional fields
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Update appointments table to use proper status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    END IF;
END$$;

ALTER TABLE public.appointments 
ALTER COLUMN status TYPE appointment_status USING status::appointment_status;

-- Create audit log table for HIPAA compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (only admins can read)
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create consent records table
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL DEFAULT 'terms_and_service',
  consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on consent_records table
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Create policies for consent_records table
CREATE POLICY "Users can create their own consent records" 
ON public.consent_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consent records" 
ON public.consent_records 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert sample doctors data for Bangladesh
INSERT INTO public.doctors (user_id, specialty, license_number, bio, years_experience, consultation_fee, photo_url, experience, approved) VALUES
(gen_random_uuid(), 'General Medicine', 'BMDC001', 'Experienced general physician with 15 years of practice in Dhaka', 15, 800, '/images/doctors/dr-rahman.jpg', 15, true),
(gen_random_uuid(), 'Cardiology', 'BMDC002', 'Specialist in heart diseases and cardiovascular surgery', 12, 1500, '/images/doctors/dr-ahmed.jpg', 12, true),
(gen_random_uuid(), 'Pediatrics', 'BMDC003', 'Child specialist with expertise in pediatric care', 10, 1000, '/images/doctors/dr-sultana.jpg', 10, true),
(gen_random_uuid(), 'Dermatology', 'BMDC004', 'Skin specialist and cosmetic dermatologist', 8, 1200, '/images/doctors/dr-khan.jpg', 8, true),
(gen_random_uuid(), 'Orthopedics', 'BMDC005', 'Bone and joint specialist', 18, 1800, '/images/doctors/dr-hassan.jpg', 18, true)
ON CONFLICT DO NOTHING;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for chat PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-pdfs', 'chat-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for chat PDFs
CREATE POLICY "Users can upload their own chat PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'chat-pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own chat PDFs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all chat PDFs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-pdfs' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);