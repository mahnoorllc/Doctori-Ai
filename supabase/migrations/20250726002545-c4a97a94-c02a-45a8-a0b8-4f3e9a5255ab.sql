-- Add medicine cache table for AI-powered medicine lookup
CREATE TABLE public.medicine_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_name TEXT NOT NULL,
  medicine_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster medicine lookups
CREATE INDEX idx_medicine_cache_name ON public.medicine_cache(medicine_name);

-- Enable RLS
ALTER TABLE public.medicine_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read medicine data (public information)
CREATE POLICY "Medicine data is publicly readable" 
ON public.medicine_cache 
FOR SELECT 
USING (true);

-- Add user roles to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'admin'));

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'doctor'
  AND appointments.doctor_id = auth.uid()
));

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create doctors table for professional profiles
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  specialty TEXT NOT NULL,
  license_number TEXT,
  years_experience INTEGER,
  bio TEXT,
  consultation_fee INTEGER,
  availability JSONB,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors
CREATE POLICY "Doctors data is publicly readable" 
ON public.doctors 
FOR SELECT 
USING (verified = true);

CREATE POLICY "Doctors can update their own profile" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own profile" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_medicine_cache_updated_at
BEFORE UPDATE ON public.medicine_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();