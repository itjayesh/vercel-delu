# Fix Vercel Root Directory Error

The error "The specified Root Directory 'package.json' is not a valid directory" means the Root Directory setting in Vercel is incorrectly configured.

## Steps to Fix:

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Click on your "deluv0" project

2. **Go to Project Settings**
   - Click on "Settings" tab
   - Click on "General" in the left sidebar

3. **Fix Root Directory**
   - Scroll down to "Build & Development Settings"
   - Find "Root Directory" field
   - **CLEAR the field completely** (leave it empty)
   - Or set it to `.` (dot) for root directory

4. **Verify Other Settings**
   - Framework Preset: **Vite**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

5. **Save Settings**
   - Click "Save" button
   - Trigger a new deployment

## What Was Wrong:
- Root Directory was set to "package.json" (a file, not a directory)
- Should be empty or "." for root directory

## Expected Result:
- Build should now work and create the `dist` directory
- No more "invalid directory" error
