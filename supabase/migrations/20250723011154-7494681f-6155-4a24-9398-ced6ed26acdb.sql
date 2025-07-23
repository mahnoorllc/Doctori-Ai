
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  emergency_contact TEXT,
  medical_conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  urgency_level TEXT DEFAULT 'low' CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
  primary_symptoms TEXT[],
  specialty_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create medical assessments table
CREATE TABLE public.medical_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions ON DELETE CASCADE,
  symptoms JSONB NOT NULL,
  assessment_data JSONB,
  recommendations TEXT[],
  urgency_score INTEGER CHECK (urgency_score >= 0 AND urgency_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create doctor visit preparations table
CREATE TABLE public.visit_preparations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  session_id UUID REFERENCES public.chat_sessions ON DELETE CASCADE,
  summary TEXT NOT NULL,
  questions TEXT[],
  symptoms_timeline JSONB,
  medications_to_discuss TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_preparations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for chat sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for chat messages
CREATE POLICY "Users can view messages from their sessions" ON public.chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create messages in their sessions" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);

-- Create RLS policies for medical assessments
CREATE POLICY "Users can view their own assessments" ON public.medical_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = medical_assessments.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create their own assessments" ON public.medical_assessments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = medical_assessments.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);

-- Create RLS policies for visit preparations
CREATE POLICY "Users can view their own visit preparations" ON public.visit_preparations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own visit preparations" ON public.visit_preparations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own visit preparations" ON public.visit_preparations FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
