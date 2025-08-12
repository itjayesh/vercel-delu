# Vercel Deployment Configuration Guide

## Method 1: Configure Output Directory in Vercel Dashboard

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (deluv0)

2. **Navigate to Project Settings**
   - Click on the "Settings" tab
   - Go to "General" section

3. **Configure Build & Output Settings**
   - Scroll down to "Build & Output Settings"
   - Set the following:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Save Settings**
   - Click "Save" to apply changes

## Method 2: Use vercel.json (Already configured)

The `vercel.json` file in your project root already contains:

\`\`\`json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
\`\`\`

## Method 3: Environment Variables Setup

1. **In Vercel Dashboard > Settings > Environment Variables**
   - Add: `VITE_SUPABASE_URL` = your_supabase_url
   - Add: `VITE_SUPABASE_ANON_KEY` = your_supabase_anon_key

## Troubleshooting Build Issues

### If build fails with "No Output Directory":

1. **Check build logs** in Vercel deployment details
2. **Verify package.json scripts**:
   \`\`\`json
   "scripts": {
     "build": "tsc && vite build"
   }
   \`\`\`
3. **Ensure vite.config.ts has correct outDir**:
   \`\`\`typescript
   build: {
     outDir: "dist"
   }
   \`\`\`

### Common Build Errors:

1. **TypeScript errors**: Fix type issues in components
2. **Missing dependencies**: Check package.json
3. **Path resolution**: Verify tsconfig.json paths
4. **Environment variables**: Ensure they're prefixed with VITE_

## Deployment Steps:

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings (as above)
4. Add environment variables
5. Deploy
6. Run SQL scripts in Supabase
7. Test the application

## Post-Deployment Checklist:

- [ ] App loads without errors
- [ ] Authentication works
- [ ] Database connection established
- [ ] Real-time features working
- [ ] Mobile responsiveness verified
- [ ] All routes accessible
