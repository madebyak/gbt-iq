# GPT-IQ Deployment Guide

This guide outlines the steps to deploy the GPT-IQ application to GitHub and Vercel.

## Deployment Checklist

### 1. Environment Variables

- [ ] Ensure `.env.local` is in `.gitignore` (to prevent API key exposure)
- [ ] Create a Vercel account if you don't have one
- [ ] Have your Gemini API key ready for Vercel deployment

### 2. GitHub Repository Setup

1. Initialize Git repository (if not already done):

```bash
git init
```

2. Add all files to Git:

```bash
git add .
```

3. Create initial commit:

```bash
git commit -m "Initial commit of GPT-IQ"
```

4. Connect your local repository to GitHub:

```bash
git remote add origin https://github.com/madebyak/gbt-iq.git
git branch -M main
git push -u origin main
```

### 3. Vercel Deployment

#### Option 1: Deploy from GitHub

1. Log in to Vercel and click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
4. Add environment variables:
   - Name: GEMINI_API_KEY
   - Value: Your Gemini API key
5. Set up custom domain:
   - Go to Project Settings > Domains
   - Add your domain: gbt-iq.com
   - Follow Vercel's instructions to configure DNS settings
6. Click "Deploy"

#### Option 2: Deploy with Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Log in to Vercel:

```bash
vercel login
```

3. Deploy the project:

```bash
vercel
```

4. Follow the CLI prompts:
   - Set up and deploy: Yes
   - Link to existing project: No
   - Project name: gbt-iq (or your preferred name)
   - Directory: ./
   - Override settings: No

5. Add your environment variable:

```bash
vercel env add GEMINI_API_KEY
```

6. Set up your custom domain:

```bash
vercel domains add gbt-iq.com
```

7. Deploy to production:

```bash
vercel --prod
```

### 4. Post-Deployment

- [ ] Verify the application works correctly on the deployed URL
- [ ] Test chat functionality with Arabic text
- [ ] Check RTL text rendering
- [ ] Verify responsive design on mobile devices
- [ ] Test keyboard shortcuts
- [ ] Ensure swipe gestures work on mobile

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Verify the environment variable is correctly set in Vercel
   - Check for any typos in the variable name

2. **Build Failures**
   - Check Vercel build logs for errors
   - Ensure all dependencies are correctly listed in package.json

3. **RTL Text Issues**
   - Verify CSS is correctly loaded
   - Check browser compatibility

4. **Styling Problems**
   - Ensure Tailwind CSS is properly configured
   - Check for any missing CSS imports

## Custom Domain Setup

1. In your Vercel project settings, go to "Domains"
2. Add your custom domain: gbt-iq.com
3. Vercel will provide you with nameserver or DNS record information
4. Update your domain's DNS settings with your domain registrar
5. Wait for DNS propagation (can take up to 48 hours)
6. Verify the domain is properly connected in Vercel

## Maintenance

- Regularly update dependencies for security patches
- Monitor Vercel usage and analytics
- Keep your Gemini API key secure and rotate it periodically
