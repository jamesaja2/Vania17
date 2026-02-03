-- ============================================
-- KARLA'S SWEET 17 DATABASE SETUP
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- This will create all necessary tables and configurations

-- ============================================
-- 1. CREATE RSVP TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.rsvp (
    id BIGSERIAL PRIMARY KEY,
    guest_name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir')),
    guest_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON public.rsvp(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_attendance ON public.rsvp(attendance);

-- Add comments for documentation
COMMENT ON TABLE public.rsvp IS 'Stores RSVP responses from guests';
COMMENT ON COLUMN public.rsvp.guest_name IS 'Name of the guest';
COMMENT ON COLUMN public.rsvp.attendance IS 'Whether guest will attend (hadir) or not (tidak_hadir)';
COMMENT ON COLUMN public.rsvp.guest_count IS 'Number of people attending (0 if not attending)';

-- ============================================
-- 2. CREATE WISHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wishes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.wishes IS 'Stores birthday wishes and messages from guests';
COMMENT ON COLUMN public.wishes.name IS 'Name of the person sending the wish';
COMMENT ON COLUMN public.wishes.message IS 'The birthday wish message';

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES FOR RSVP TABLE
-- ============================================

-- Allow anyone to INSERT new RSVP (for guests to submit)
CREATE POLICY "Allow public insert on rsvp" 
ON public.rsvp 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow anyone to READ all RSVPs (for displaying stats)
CREATE POLICY "Allow public read on rsvp" 
ON public.rsvp 
FOR SELECT 
TO public 
USING (true);

-- Optional: Allow updates (uncomment if needed)
-- CREATE POLICY "Allow public update on rsvp" 
-- ON public.rsvp 
-- FOR UPDATE 
-- TO public 
-- USING (true) 
-- WITH CHECK (true);

-- Optional: Allow deletes (uncomment if needed for admin)
-- CREATE POLICY "Allow public delete on rsvp" 
-- ON public.rsvp 
-- FOR DELETE 
-- TO public 
-- USING (true);

-- ============================================
-- 5. CREATE RLS POLICIES FOR WISHES TABLE
-- ============================================

-- Allow anyone to INSERT new wishes (for guests to submit)
CREATE POLICY "Allow public insert on wishes" 
ON public.wishes 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow anyone to READ all wishes (for displaying on website)
CREATE POLICY "Allow public read on wishes" 
ON public.wishes 
FOR SELECT 
TO public 
USING (true);

-- Optional: Allow updates (uncomment if needed)
-- CREATE POLICY "Allow public update on wishes" 
-- ON public.wishes 
-- FOR UPDATE 
-- TO public 
-- USING (true) 
-- WITH CHECK (true);

-- Optional: Allow deletes (uncomment if needed for admin)
-- CREATE POLICY "Allow public delete on wishes" 
-- ON public.wishes 
-- FOR DELETE 
-- TO public 
-- USING (true);

-- ============================================
-- 6. CREATE HELPER VIEWS (OPTIONAL)
-- ============================================

-- View to get RSVP statistics
CREATE OR REPLACE VIEW public.rsvp_stats AS
SELECT 
    COUNT(*) FILTER (WHERE attendance = 'hadir') as total_attending,
    COUNT(*) FILTER (WHERE attendance = 'tidak_hadir') as total_not_attending,
    SUM(guest_count) FILTER (WHERE attendance = 'hadir') as total_guests,
    COUNT(*) as total_responses
FROM public.rsvp;

-- Grant access to the view
GRANT SELECT ON public.rsvp_stats TO anon, authenticated;

-- ============================================
-- 7. INSERT SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================
-- Uncomment the lines below if you want to add sample data for testing

-- INSERT INTO public.wishes (name, message) VALUES 
-- ('John Doe', 'Happy Sweet 17th Birthday Karla! Wishing you all the best! 🎉'),
-- ('Jane Smith', 'Have an amazing celebration! You deserve it! 💕'),
-- ('Michael Brown', 'Happy birthday! May all your dreams come true! 🎂');

-- INSERT INTO public.rsvp (guest_name, attendance, guest_count) VALUES 
-- ('John Doe', 'hadir', 2),
-- ('Jane Smith', 'hadir', 1),
-- ('Michael Brown', 'tidak_hadir', 0);

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rsvp', 'wishes');

-- Check RSVP table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rsvp' 
AND table_schema = 'public';

-- Check wishes table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'wishes' 
AND table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('rsvp', 'wishes');

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- Your database is now ready to use with the Sweet 17 invitation app
-- 
-- Next steps:
-- 1. Make sure your SUPABASE_URL and SUPABASE_ANON_KEY are correct in App.jsx
-- 2. Test the RSVP functionality on your website
-- 3. Test the wishes/messages functionality
-- 4. Access admin panel at: ?admin=true
-- 5. Default admin password: vania17 (change this in App.jsx if needed)
