-- Fix admin profile policies to prevent infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create new admin policies using the security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.get_current_user_role() = 'admin');

-- Update doctors table policies to restrict public access
DROP POLICY IF EXISTS "Doctors data is publicly readable" ON public.doctors;

-- Create restricted policies for doctors table
CREATE POLICY "Doctors can view their own profile"
ON public.doctors
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all doctors"
ON public.doctors
FOR SELECT
USING (public.get_current_user_role() = 'admin');