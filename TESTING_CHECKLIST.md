# Deployment Testing Checklist for delu.live

## Pre-Deployment Verification
- [ ] Environment variables set in Vercel dashboard
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
- [ ] Supabase database tables created
- [ ] Supabase storage buckets configured
- [ ] RLS policies enabled

## Authentication Testing
- [ ] User registration works
  - [ ] Email validation
  - [ ] Password requirements
  - [ ] Profile creation
- [ ] User login works
  - [ ] Correct credentials
  - [ ] Error handling for wrong credentials
- [ ] User logout works
- [ ] Session persistence across page refreshes
- [ ] Protected routes redirect to login when not authenticated

## Core Features Testing

### Live Gigs Page
- [ ] Displays available gigs
- [ ] Shows gig details (price, location, deadline)
- [ ] Accept gig functionality works
- [ ] Real-time updates when new gigs are posted
- [ ] Filters out user's own gigs
- [ ] Shows "No gigs available" when empty

### My Gigs Page
- [ ] Shows requested gigs tab
- [ ] Shows accepted gigs tab
- [ ] Displays correct gig counts
- [ ] Status updates work (picked up, delivered)
- [ ] Shows appropriate actions for each status

### Create Gig Page
- [ ] Form validation works
- [ ] Gig creation successful
- [ ] Redirects to My Gigs after creation
- [ ] New gig appears in Live Gigs for others

### Wallet Features
- [ ] Displays current balance
- [ ] Load wallet modal opens
- [ ] Screenshot capture works
- [ ] UTR number validation
- [ ] Coupon code application
- [ ] Withdrawal modal opens
- [ ] UPI ID validation
- [ ] Minimum/maximum amount validation

### Admin Features (if admin user)
- [ ] Admin dashboard accessible
- [ ] User management works
- [ ] Gig management works
- [ ] Wallet load request approval
- [ ] Withdrawal request processing
- [ ] Coupon management

## UI/UX Testing

### Responsive Design
- [ ] Mobile view works correctly
- [ ] Tablet view works correctly
- [ ] Desktop view works correctly
- [ ] Navigation menu responsive
- [ ] Modals work on all screen sizes

### Interactive Elements
- [ ] All buttons clickable and responsive
- [ ] Loading states show correctly
- [ ] Error messages display properly
- [ ] Success messages show
- [ ] Form validation feedback

### Camera/File Upload
- [ ] Camera capture works on mobile
- [ ] File selection works on desktop
- [ ] Image preview displays
- [ ] File upload completes successfully

## Real-time Features
- [ ] New gigs appear without refresh
- [ ] Gig status updates in real-time
- [ ] User balance updates after transactions
- [ ] Notifications work (if implemented)

## Error Handling
- [ ] Network errors handled gracefully
- [ ] Invalid data submissions rejected
- [ ] User-friendly error messages
- [ ] Fallback UI for failed states

## Performance Testing
- [ ] Page load times acceptable
- [ ] Image loading optimized
- [ ] No console errors
- [ ] Smooth animations and transitions

## Security Testing
- [ ] User can only see their own data
- [ ] Protected routes secured
- [ ] File uploads validated
- [ ] SQL injection prevention
- [ ] XSS prevention

## Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Test User Scenarios

### New User Journey
1. [ ] Visit site
2. [ ] Click login/signup
3. [ ] Create account
4. [ ] Complete profile
5. [ ] Browse available gigs
6. [ ] Accept a gig
7. [ ] Complete delivery
8. [ ] Check wallet balance

### Existing User Journey
1. [ ] Login with existing credentials
2. [ ] Check My Gigs
3. [ ] Create new gig request
4. [ ] Load wallet
5. [ ] Request withdrawal
6. [ ] Use referral system

### Admin User Journey
1. [ ] Login as admin
2. [ ] Access admin dashboard
3. [ ] Approve wallet load requests
4. [ ] Process withdrawal requests
5. [ ] Manage users and gigs
6. [ ] Create/manage coupons

## Post-Deployment Monitoring
- [ ] Check Vercel deployment logs
- [ ] Monitor Supabase usage
- [ ] Check for runtime errors
- [ ] Verify database connections
- [ ] Test real-time subscriptions

## Common Issues to Check
- [ ] CORS errors resolved
- [ ] Environment variables accessible
- [ ] Database connection stable
- [ ] File upload permissions correct
- [ ] Real-time subscriptions working
- [ ] Mobile touch events responsive

## Performance Metrics
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 4s
- [ ] Cumulative Layout Shift < 0.1
- [ ] First Input Delay < 100ms

Use this checklist to systematically verify that all features work correctly after deployment.
