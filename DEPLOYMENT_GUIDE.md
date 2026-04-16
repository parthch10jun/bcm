# Deployment Guide - Vercel

## 🚀 Quick Deploy to Vercel

This guide will help you deploy the BIA/BCM frontend application to Vercel.

---

## **Method 1: Deploy via Vercel Dashboard (Recommended)**

### **Prerequisites**
- GitHub account
- Vercel account (free tier works perfectly)

### **Steps**

#### **1. Go to Vercel**
Visit: https://vercel.com/new

#### **2. Import Your Repository**
- Click **"Import Project"** or **"Add New..."** → **"Project"**
- Select **"Import Git Repository"**
- Choose your repository: `parthch10jun/bcm`
- Click **"Import"**

#### **3. Configure Project Settings**

**IMPORTANT**: Since the Next.js app is in the `bia-module` subfolder, you must set:

```
Root Directory: bia-module
```

Click **"Edit"** next to "Root Directory" and enter: `bia-module`

**Framework Preset**: Next.js (auto-detected)

**Build & Development Settings**:
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Development Command: `npm run dev` (default)

#### **4. Environment Variables** (Optional)
If you have any environment variables, add them now. Currently, the app doesn't require any.

#### **5. Deploy**
Click **"Deploy"**

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the Next.js app
4. Deploy to a production URL

**Deployment time**: ~2-3 minutes

#### **6. Access Your App**
Once deployed, you'll get a URL like:
```
https://bcm-[random-id].vercel.app
```

Or you can set a custom domain.

---

## **Method 2: Deploy via Vercel CLI**

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Navigate to Project Directory**

```bash
cd /Users/parthc/Documents/Ascent/bse-demo-instance/bia-module
```

### **Step 4: Deploy**

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time)
- **What's your project's name?** → bcm-platform (or any name)
- **In which directory is your code located?** → ./
- **Want to override settings?** → No

The CLI will:
1. Create a new project on Vercel
2. Build and deploy your app
3. Provide you with deployment URLs

### **Step 5: Deploy to Production**

```bash
vercel --prod
```

---

## **What Gets Deployed**

### **Included**:
✅ All frontend pages and components
✅ BIA Records module
✅ IT DR Plans module
✅ Crisis Management module
✅ Incident Management (ITSM) module
✅ IT Service Catalog
✅ Testing module
✅ Reporting dashboards
✅ All demo data and mock services

### **Not Included**:
❌ Backend API (uses mock data)
❌ Database (uses in-memory mock data)
❌ Authentication (demo mode)

---

## **Post-Deployment Configuration**

### **1. Set Custom Domain** (Optional)
1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `bcm.yourcompany.com`)
4. Follow DNS configuration instructions

### **2. Environment Variables** (If Needed Later)
1. Go to **"Settings"** → **"Environment Variables"**
2. Add variables for different environments:
   - Production
   - Preview
   - Development

### **3. Deployment Protection** (Optional)
For demo purposes, you might want to password-protect:
1. Go to **"Settings"** → **"Deployment Protection"**
2. Enable **"Password Protection"**
3. Set a password for stakeholder demos

---

## **Automatic Deployments**

Once connected, Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every pull request or push to other branches

Each preview deployment gets a unique URL for testing.

---

## **Troubleshooting**

### **Issue: Build Fails**

**Solution**: Check build logs in Vercel dashboard. Common issues:
- Missing dependencies → Run `npm install` locally first
- TypeScript errors → Run `npx tsc --noEmit` to check

### **Issue: 404 on All Routes**

**Solution**: Ensure **Root Directory** is set to `bia-module`

### **Issue: Environment Variables Not Working**

**Solution**: Add them in Vercel Dashboard under Settings → Environment Variables

---

## **Vercel Configuration File**

A `vercel.json` file has been added to the root directory with the following settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

This file tells Vercel how to build the project when deploying from the `bia-module` directory.

---

## **Development Workflow**

### **Local Development**
```bash
cd bia-module
npm run dev
```
App runs on http://localhost:3000

### **Test Production Build Locally**
```bash
cd bia-module
npm run build
npm start
```

### **Deploy to Preview (CLI)**
```bash
cd bia-module
vercel
```

### **Deploy to Production (CLI)**
```bash
cd bia-module
vercel --prod
```

---

## **URLs After Deployment**

You'll get three types of URLs:

1. **Production URL**: `https://bcm-platform.vercel.app`
2. **Latest Deployment**: `https://bcm-platform-abc123.vercel.app`
3. **Git Branch Previews**: `https://bcm-platform-git-feature-branch.vercel.app`

---

## **Next Steps After Deployment**

1. ✅ Share the production URL with stakeholders
2. ✅ Test all modules (BIA, DR Plans, Crisis Management, Incidents)
3. ✅ Set up custom domain (optional)
4. ✅ Enable password protection for demos (optional)
5. ✅ Configure analytics (Vercel Analytics available)

---

## **Cost**

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments

**This is perfect for demos and MVPs!**

---

## **Support**

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

---

**Ready to deploy? Go to https://vercel.com/new and follow Method 1!** 🚀
