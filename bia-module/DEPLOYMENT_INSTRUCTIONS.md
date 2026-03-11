# BSE AutoResilience Platform - Deployment Instructions

## 📦 Package Contents

This package contains the complete BSE AutoResilience platform with:
- ✅ Production-ready Next.js build
- ✅ All source code and components
- ✅ MITKAT Dashboard with 3D globe and Lottie animations
- ✅ 82 fully functional pages
- ✅ Tailwind CSS configuration
- ✅ All dependencies listed in package.json

---

## 🚀 Quick Start Guide

### **Step 1: Extract the Package**

```bash
# Extract the ZIP file
unzip bia-module-production.zip

# Navigate to the folder
cd bia-module
```

### **Step 2: Install Dependencies**

**IMPORTANT:** You must install dependencies before running the application!

```bash
npm install
```

This will install all required packages including:
- React, Next.js, TypeScript
- Tailwind CSS
- Three.js (for 3D globe)
- Lottie animations
- All other dependencies

**⏱️ Installation time:** 2-5 minutes depending on your internet connection

### **Step 3: Run the Application**

**Option A: Production Mode (Recommended)**
```bash
npm run start
```
- Uses the pre-built optimized production build
- Faster performance
- Best for production deployment

**Option B: Development Mode**
```bash
npm run dev
```
- Hot reload enabled for live updates
- Better for development and debugging
- Slower than production mode

### **Step 4: Access the Application**

Once the server starts, you'll see:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
✓ Ready in 1.5s
```

Open your browser and navigate to:
- **Main Dashboard:** http://localhost:3000
- **MITKAT Dashboard:** http://localhost:3000/mitkat-dashboard

---

## 🔧 Troubleshooting

### **Problem: Styles not loading / Oversized icons**

**Symptoms:** You see large unstyled icons or elements instead of the proper interface

**Solution:**
```bash
# Clean the build cache
rm -rf .next node_modules/.cache

# Rebuild the application
npm run build

# Start the server
npm run start
```

### **Problem: Port already in use**

**Symptoms:** Error message "Port 3000 is already in use"

**Solution:** Next.js will automatically try the next available port (3001, 3002, etc.)
Just use the port shown in the terminal output.

### **Problem: Module not found errors**

**Symptoms:** Errors about missing modules or packages

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 System Requirements

- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher
- **Operating System:** macOS, Linux, or Windows
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** ~500MB for node_modules

---

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (required first time) |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check code for linting errors |

---

## 🌟 Key Features

- **MITKAT Dashboard:** Multi-hazard Impact and Threat Knowledge Assessment Tool
  - 3D rotating Earth globe with realistic lighting
  - Live threat feed with animated markers
  - Lottie paper plane animations
  - Real-time threat monitoring

- **Business Continuity Management:** Complete BCM lifecycle management
- **Risk Assessment:** Comprehensive risk evaluation tools
- **Crisis Management:** Playbooks and incident response
- **IT Disaster Recovery:** DR planning and simulation
- **Reporting:** Executive dashboards and analytics

---

## 📞 Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Ensure all dependencies are installed (`npm install`)
3. Try cleaning the cache and rebuilding
4. Check that you're using Node.js 18.x or higher

---

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] Dependencies installed successfully (`npm install` completed)
- [ ] Server starts without errors
- [ ] Home page loads at http://localhost:3000
- [ ] Navigation menu appears on the left
- [ ] Styles are loading correctly (no oversized icons)
- [ ] MITKAT Dashboard shows 3D globe at /mitkat-dashboard

---

**Package Version:** Production Build - December 2025
**Platform:** BSE AutoResilience - AI Powered Integrated GRC Platform

