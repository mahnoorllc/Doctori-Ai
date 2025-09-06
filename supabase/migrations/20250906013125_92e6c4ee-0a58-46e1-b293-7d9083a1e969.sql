-- Phase 1: Harden role assignment and protect privileged columns

-- 1. Update handle_new_user function to always set role='user' and approval_status='pending'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, approval_status)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    'user', -- Always set to user, ignore any client-provided role
    'pending' -- Always set to pending, require admin approval
  );
  RETURN NEW;
END;
$function$;

-- 2. Create trigger to protect privileged profile columns
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins to change role and approval_status
  IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.approval_status IS DISTINCT FROM NEW.approval_status) THEN
    IF public.get_current_user_role() != 'admin' THEN
      RAISE EXCEPTION 'Only admins can modify role or approval status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger
DROP TRIGGER IF EXISTS protect_privileged_columns_trigger ON public.profiles;
CREATE TRIGGER protect_privileged_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_privileged_profile_columns();

-- Phase 2: Create rate limiting table for OpenAI API abuse protection
CREATE TABLE IF NOT EXISTS public.rate_limiter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address inet NOT NULL,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for efficient rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limiter_ip_endpoint ON public.rate_limiter(ip_address, endpoint, window_start);

-- RLS for rate_limiter (only system can manage)
ALTER TABLE public.rate_limiter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits" 
ON public.rate_limiter 
FOR ALL 
USING (false); -- No direct access via client

-- Phase 3: Create safe public view for doctors
CREATE OR REPLACE VIEW public.doctors_public AS
SELECT 
  id,
  specialty,
  experience,
  consultation_fee,
  photo_url,
  bio,
  verified,
  created_at
FROM public.doctors
WHERE verified = true;

-- Enable RLS on the view and allow public read
ALTER VIEW public.doctors_public SET (security_invoker = true);

-- Grant public access to the view
GRANT SELECT ON public.doctors_public TO anon, authenticated;

-- Create function for rate limiting checks
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip_address inet,
  _endpoint text,
  _max_requests integer DEFAULT 10,
  _window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  window_start_time := now() - interval '1 minute' * _window_minutes;
  
  -- Clean old entries
  DELETE FROM public.rate_limiter 
  WHERE window_start < window_start_time;
  
  -- Get current count for this IP and endpoint
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM public.rate_limiter
  WHERE ip_address = _ip_address 
    AND endpoint = _endpoint 
    AND window_start >= window_start_time;
  
  -- If under limit, increment and allow
  IF current_count < _max_requests THEN
    INSERT INTO public.rate_limiter (ip_address, endpoint, request_count, window_start)
    VALUES (_ip_address, _endpoint, 1, now())
    ON CONFLICT (id) DO NOTHING;
    RETURN true;
  END IF;
  
  -- Over limit
  RETURN false;
END;
$function$;

-- Function to safely log activity without exposing to clients
CREATE OR REPLACE FUNCTION public.log_activity_safe(
  _action text,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.activity_logs (actor_id, action, metadata)
  VALUES (auth.uid(), _action, _metadata);
END;
$function$;