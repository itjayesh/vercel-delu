-- Insert platform configuration
INSERT INTO public.platform_config (key, value, description) VALUES
('platform_fee', '2.00', 'Platform fee charged per gig completion'),
('referral_bonus', '10.00', 'Bonus amount for successful referrals'),
('min_withdrawal_amount', '50.00', 'Minimum amount required for withdrawal'),
('max_gig_price', '500.00', 'Maximum allowed price for a single gig'),
('welcome_bonus', '10.00', 'Welcome bonus for new users')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_amount, discount_type, min_order_amount, max_uses, expires_at) VALUES
('WELCOME10', 10.00, 'fixed', 50.00, 100, NOW() + INTERVAL '30 days'),
('SAVE5', 5.00, 'fixed', 25.00, 200, NOW() + INTERVAL '15 days'),
('STUDENT20', 20.00, 'percentage', 100.00, 50, NOW() + INTERVAL '60 days')
ON CONFLICT (code) DO NOTHING;

-- Create admin user function (to be called after first admin signs up)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET is_admin = true
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: After your first admin user signs up with admin@delu.live, run:
-- SELECT public.make_user_admin('admin@delu.live');
