-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Generate referral code
  UPDATE public.users 
  SET referral_code = 'DELU' || UPPER(SUBSTRING(MD5(NEW.id::text), 1, 6))
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  user_uuid UUID,
  amount_change DECIMAL(10,2),
  transaction_type TEXT,
  description_text TEXT DEFAULT NULL,
  gig_uuid UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL(10,2);
BEGIN
  -- Get current balance
  SELECT wallet_balance INTO current_balance
  FROM public.users
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF current_balance IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if debit would result in negative balance
  IF transaction_type = 'debit' AND (current_balance + amount_change) < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Update wallet balance
  UPDATE public.users
  SET 
    wallet_balance = wallet_balance + amount_change,
    total_earnings = CASE 
      WHEN transaction_type = 'credit' THEN total_earnings + amount_change
      ELSE total_earnings
    END,
    total_spent = CASE 
      WHEN transaction_type = 'debit' THEN total_spent + ABS(amount_change)
      ELSE total_spent
    END,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Insert transaction record
  INSERT INTO public.transactions (user_id, gig_id, type, amount, description)
  VALUES (user_uuid, gig_uuid, transaction_type, amount_change, description_text);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process gig completion
CREATE OR REPLACE FUNCTION public.complete_gig(
  gig_uuid UUID,
  completion_photo TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  gig_record RECORD;
  platform_fee DECIMAL(10,2) := 2.00; -- ₹2 platform fee
BEGIN
  -- Get gig details
  SELECT * INTO gig_record
  FROM public.gigs
  WHERE id = gig_uuid AND status = 'in_progress';
  
  IF gig_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update gig status
  UPDATE public.gigs
  SET 
    status = 'completed',
    completion_photo_url = completion_photo,
    updated_at = NOW()
  WHERE id = gig_uuid;
  
  -- Pay the deliverer (gig price minus platform fee)
  PERFORM public.update_wallet_balance(
    gig_record.accepted_by,
    gig_record.price - platform_fee,
    'credit',
    'Gig completion payment for: ' || gig_record.title,
    gig_uuid
  );
  
  -- Deduct from customer
  PERFORM public.update_wallet_balance(
    gig_record.created_by,
    -gig_record.price,
    'debit',
    'Payment for gig: ' || gig_record.title,
    gig_uuid
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle referral bonus
CREATE OR REPLACE FUNCTION public.process_referral_bonus(
  referrer_code TEXT,
  new_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_id UUID;
  bonus_amount DECIMAL(10,2) := 10.00; -- ₹10 referral bonus
BEGIN
  -- Find referrer
  SELECT id INTO referrer_id
  FROM public.users
  WHERE referral_code = referrer_code;
  
  IF referrer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update referred_by for new user
  UPDATE public.users
  SET referred_by = referrer_code
  WHERE id = new_user_id;
  
  -- Give bonus to referrer
  PERFORM public.update_wallet_balance(
    referrer_id,
    bonus_amount,
    'credit',
    'Referral bonus for inviting new user'
  );
  
  -- Give bonus to new user
  PERFORM public.update_wallet_balance(
    new_user_id,
    bonus_amount,
    'credit',
    'Welcome bonus for joining via referral'
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_load_requests_updated_at BEFORE UPDATE ON public.wallet_load_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
