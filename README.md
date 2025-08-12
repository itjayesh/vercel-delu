# Delu Live - Peer-to-Peer Delivery Platform

A modern peer-to-peer delivery platform built for college campuses, connecting students who need items delivered with those willing to deliver them.

## Features

- 🚀 **Real-time Gig Updates** - See new delivery requests instantly
- 💰 **Integrated Wallet System** - Secure payments and earnings tracking
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📸 **Photo Verification** - Acceptance selfies and completion photos
- 👨‍💼 **Admin Dashboard** - Comprehensive management tools
- 🎁 **Referral System** - Earn bonuses for inviting friends
- 🏷️ **Coupon System** - Discount codes and promotions

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <your-repo-url>
cd delu-live
npm install
\`\`\`

### 2. Set up Supabase
1. Create a new Supabase project
2. Run the SQL scripts in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-policies.sql`
   - `scripts/03-create-functions.sql`
   - `scripts/04-seed-data.sql`
   - `scripts/05-create-storage-buckets.sql`

### 3. Configure Environment Variables
\`\`\`bash
cp .env.example .env
\`\`\`
Add your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 5. Create Admin User
1. Sign up with `admin@delu.live`
2. Run in Supabase SQL Editor:
\`\`\`sql
SELECT public.make_user_admin('admin@delu.live');
\`\`\`

## Deployment to Vercel

### Automatic Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
\`\`\`bash
npm run build
npx vercel --prod
\`\`\`

## Environment Variables for Vercel

Add these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Schema

### Core Tables
- `users` - User profiles and wallet data
- `gigs` - Delivery requests and assignments
- `transactions` - Payment and earning records
- `wallet_load_requests` - Wallet top-up requests
- `withdrawal_requests` - Withdrawal requests
- `coupons` - Discount codes
- `platform_config` - App configuration

### Storage Buckets
- `profile-photos` - User profile pictures
- `college-ids` - College ID verification
- `acceptance-selfies` - Gig acceptance photos
- `wallet-screenshots` - Payment screenshots

## Key Features

### For Students (Customers)
- Post delivery requests
- Track delivery status
- Secure payments via wallet
- Rate and review deliverers

### For Deliverers
- Browse available gigs
- Accept delivery requests
- Upload verification photos
- Earn money and track earnings

### For Admins
- Manage all users and gigs
- Approve wallet load requests
- Process withdrawals
- View analytics and reports
- Manage coupons and platform settings

## Security Features

- Row Level Security (RLS) policies
- Secure file uploads with access controls
- JWT-based authentication
- Admin role verification
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support, email support@delu.live or create an issue in the repository.

## License

This project is proprietary software. All rights reserved.
