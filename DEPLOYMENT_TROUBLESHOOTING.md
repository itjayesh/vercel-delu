# Deployment Troubleshooting Guide

## Root Directory Error Fix

The error "The specified Root Directory 'package.json' is not a valid directory" occurs when Vercel's Root Directory setting is incorrectly configured.

### Step-by-Step Fix:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click on "Settings" tab
   - Go to "General" section

2. **Find Build & Output Settings**
   - Look for "Root Directory" field
   - **CRITICAL**: This field should be EMPTY (not "package.json")
   - If it shows "package.json", clear it completely

3. **Correct Settings Should Be:**
   \`\`\`
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Root Directory: [LEAVE EMPTY]
   \`\`\`

4. **Save and Redeploy**
   - Click "Save" 
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment

### Repository Structure Verification:

Your repository should have this structure:
\`\`\`
/
├── package.json          ← Should be in root
├── vite.config.ts        ← Should be in root
├── tsconfig.json         ← Should be in root
├── index.html            ← Should be in root
├── index.tsx             ← Should be in root
├── App.tsx               ← Should be in root
├── components/           ← Directory
├── pages/                ← Directory
├── lib/                  ← Directory
└── ...other files
\`\`\`

### Common Issues:

1. **Root Directory set to "package.json"** - Should be empty
2. **Wrong branch selected** - Ensure "main" branch is selected
3. **Missing package.json in root** - Verify file exists in repository root
4. **Incorrect build command** - Should be "npm run build"
5. **Wrong output directory** - Should be "dist"

### Verification Steps:

1. Check GitHub repository structure
2. Verify package.json exists in root directory
3. Confirm all configuration files are present
4. Test build locally with `npm run build`
5. Verify dist directory is created locally

If the error persists after following these steps, the issue may be with the repository setup or branch configuration.
