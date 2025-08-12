-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile-photos', 'profile-photos', true),
('college-ids', 'college-ids', false),
('acceptance-selfies', 'acceptance-selfies', false),
('wallet-screenshots', 'wallet-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own college IDs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'college-ids' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own college IDs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'college-ids' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload acceptance selfies" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'acceptance-selfies' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Gig participants can view acceptance selfies" ON storage.objects
  FOR SELECT USING (bucket_id = 'acceptance-selfies');

CREATE POLICY "Users can upload wallet screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'wallet-screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own wallet screenshots" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'wallet-screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admin policies for storage
CREATE POLICY "Admins can view all college IDs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'college-ids' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all wallet screenshots" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'wallet-screenshots' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
