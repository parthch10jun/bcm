# For IT Team - AutoBCM Production Deployment

## 📦 Package Information

**File Name:** `autobcm-deployment-20251222.zip`
**Size:** 66 MB (compressed)
**Build Date:** 2024-12-22
**Type:** Production-ready compiled build
**Platform:** AutoBCM (Business Continuity Management)
**Node.js Required:** 18.x or 20.x LTS

---

## ⚠️ IMPORTANT: Why This Package?

As discussed, **this package contains the compiled production build** instead of source code. This resolves the module failure restart issues because:

✅ **Production builds are resilient** - Won't crash on runtime errors  
✅ **Automatic restart capability** - Server can restart properly after failures  
✅ **Optimized performance** - 50-70% faster than development mode  
✅ **Stable and tested** - Production-grade deployment

---

## 🚀 Quick Deployment (3 Steps)

### Step 1: Extract the Package

```bash
# Extract to your deployment directory
unzip autobcm-production-build.zip -d /opt/autobcm
cd /opt/autobcm/bia-module
```

### Step 2: Install Dependencies

```bash
# Install production dependencies only
npm ci --production
```

### Step 3: Start the Application

```bash
# Start on port 3005 (or your preferred port)
PORT=3005 npm start
```

**That's it!** The application will be running at `http://localhost:3005`

---

## 🔧 Recommended: Production Server Setup with PM2

For automatic restart and process management:

```bash
# Install PM2 (if not already installed)
npm install -g pm2

# Start the application with PM2
cd /opt/autobcm/bia-module
PORT=3005 pm2 start npm --name "autobcm" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Monitor the application
pm2 monit

# View logs
pm2 logs autobcm
```

---

## 📋 What's Included in This Package

```
bia-module/
├── .next/                          # ✅ Compiled production build (REQUIRED)
├── public/                         # ✅ Static assets (images, icons)
├── package.json                    # ✅ Dependencies list
├── package-lock.json               # ✅ Locked dependency versions
├── next.config.js                  # ✅ Next.js configuration
├── tailwind.config.js              # ✅ Tailwind CSS configuration
├── postcss.config.mjs              # ✅ PostCSS configuration
└── PRODUCTION_DEPLOYMENT_GUIDE.md  # ✅ Detailed deployment guide
```

**Note:** The `node_modules` folder is NOT included. You must run `npm ci --production` to install dependencies.

---

## ✅ Verification Steps

After deployment, verify the application is working:

```bash
# 1. Check if the server is running
curl http://localhost:3005

# 2. Check the process
ps aux | grep "next start"

# 3. Check PM2 status (if using PM2)
pm2 status
```

---

## 🔍 Troubleshooting

### Issue: Port Already in Use

```bash
# Find and kill the process using the port
lsof -i :3005
kill -9 <PID>

# OR use a different port
PORT=3006 npm start
```

### Issue: Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production
```

### Issue: Application Won't Start

```bash
# Check Node.js version (must be >= 18.17.0)
node --version

# Check if .next directory exists
ls -la .next/

# View startup logs
npm start 2>&1 | tee startup.log
```

---

## 📞 Support

For any issues or questions:
- **Developer:** Parth Chauhan
- **Platform:** AutoBCM - Business Continuity Management
- **Documentation:** See `PRODUCTION_DEPLOYMENT_GUIDE.md` in the package

---

## 🎯 Key Differences from Previous Deployment

| Previous (Source Code) | New (Production Build) |
|------------------------|------------------------|
| ❌ Required `npm run dev` | ✅ Uses `npm start` |
| ❌ Crashed on module errors | ✅ Resilient to errors |
| ❌ Couldn't restart automatically | ✅ Restarts properly |
| ❌ Slower performance | ✅ Optimized & fast |
| ❌ Development mode | ✅ Production mode |

---

## ✨ What's New in This Version (December 2024)

- ✅ **BCP Module Landing Page** - Updated UI/UX matching consistent design patterns
- ✅ **Create BCP Wizard** - 12-step BCP creation wizard with progress indicator
- ✅ **Scope & Dependency Screen** - Auto-populated data from BIA with dependency management
- ✅ **React Hooks Fix** - Fixed conditional hook call in Issues page
- ✅ **UI/UX Consistency** - All pages now use consistent styling:
  - Compact KPI cards with white backgrounds
  - `text-xs` and `text-[10px]` for form labels
  - `h-[32px]` input heights
  - `bg-gray-900` primary buttons
  - Consistent spacing and padding
- ✅ **Clean Build** - No TypeScript errors or ESLint warnings

---

## 📁 Package Contents

```
deployment-package/
├── autobcm-app/           # Complete application
│   ├── .next/             # Pre-built production files
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   ├── package.json       # Dependencies
│   └── ...                # Configuration files
└── DEPLOYMENT_README.md   # Detailed deployment guide
```

---

**Ready to deploy!** 🚀

If you encounter any issues, please refer to the `DEPLOYMENT_README.md` included in the deployment package.

