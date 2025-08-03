-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', false);

-- Create medical_reports table
CREATE TABLE public.medical_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('health_report', 'chat_summary')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for medical_reports
CREATE POLICY "Users can view their own medical reports" 
ON public.medical_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical reports" 
ON public.medical_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view shared reports" 
ON public.medical_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.shared_reports sr 
  WHERE sr.report_id = medical_reports.id 
  AND sr.doctor_id = auth.uid()
));

-- Create shared_reports table
CREATE TABLE public.shared_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.medical_reports(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for shared_reports
CREATE POLICY "Doctors can view reports shared with them" 
ON public.shared_reports 
FOR SELECT 
USING (auth.uid() = doctor_id);

CREATE POLICY "Users can share their reports" 
ON public.shared_reports 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- Create storage policies for medical-reports bucket
CREATE POLICY "Users can upload their own medical reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own medical reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors can view shared medical reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-reports' AND EXISTS (
  SELECT 1 FROM public.shared_reports sr 
  JOIN public.medical_reports mr ON sr.report_id = mr.id 
  WHERE mr.file_path = name AND sr.doctor_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_medical_reports_updated_at
BEFORE UPDATE ON public.medical_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();