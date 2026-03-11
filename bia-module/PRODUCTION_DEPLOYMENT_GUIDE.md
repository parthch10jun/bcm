# AutoBCM Production Deployment Guide

## 📦 For IT Team - Production Build Deployment

This guide explains how to deploy the **compiled production build** of AutoBCM (Business Continuity Management) platform.

---

## ⚠️ Important: Why Production Build?

**DO NOT deploy source code directly.** Always use the compiled production build because:

1. ✅ **Optimized Performance** - 50-70% faster load times
2. ✅ **Resilient to Module Failures** - Application won't crash on runtime errors
3. ✅ **Automatic Restart** - Server can restart properly after failures
4. ✅ **Smaller Bundle Size** - Reduced bandwidth and storage requirements
5. ✅ **Production-Ready** - Minified, tree-shaken, and optimized code

---

## 📋 Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Memory**: Minimum 2GB RAM
- **Disk Space**: Minimum 500MB free space

---

## 🚀 Deployment Steps

### Step 1: Extract the Production Build Package

```bash
# Extract the deployment package
unzip autobcm-production-build.zip -d /opt/autobcm

# Navigate to the application directory
cd /opt/autobcm/bia-module
```

### Step 2: Install Dependencies

```bash
# Install production dependencies only (faster, smaller)
npm ci --production

# OR if npm ci fails, use:
npm install --production
```

### Step 3: Verify the Build

```bash
# Check if .next directory exists
ls -la .next/

# Verify package.json has start script
cat package.json | grep "start"
```

### Step 4: Start the Production Server

```bash
# Start on default port (3000)
npm start

# OR start on custom port
PORT=8080 npm start

# OR start on port 3005 (as requested)
PORT=3005 npm start
```

### Step 5: Verify the Application

```bash
# Check if the server is running
curl http://localhost:3005

# Check process
ps aux | grep "next start"
```

---

## 🔧 Production Server Setup (Recommended)

### Option 1: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
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

# Restart the application
pm2 restart autobcm

# Stop the application
pm2 stop autobcm
```

### Option 2: Using systemd (Linux)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/autobcm.service
```

Add the following content:

```ini
[Unit]
Description=AutoBCM Production Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/autobcm/bia-module
Environment="NODE_ENV=production"
Environment="PORT=3005"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable autobcm
sudo systemctl start autobcm
sudo systemctl status autobcm
```

---

## 🔍 Troubleshooting

### Issue: Port Already in Use

```bash
# Find process using the port
lsof -i :3005

# Kill the process
kill -9 <PID>

# OR use a different port
PORT=3006 npm start
```

### Issue: Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production
```

### Issue: Application Won't Start

```bash
# Check Node.js version
node --version  # Should be >= 18.17.0

# Check if .next directory exists
ls -la .next/

# Check logs
npm start 2>&1 | tee startup.log
```

---

## 📊 Monitoring & Logs

### View Application Logs (PM2)

```bash
# Real-time logs
pm2 logs autobcm --lines 100

# Error logs only
pm2 logs autobcm --err

# Clear logs
pm2 flush
```

### View Application Logs (systemd)

```bash
# View logs
sudo journalctl -u autobcm -f

# View last 100 lines
sudo journalctl -u autobcm -n 100
```

---

## 🔐 Security Recommendations

1. **Run as non-root user**: Never run as root
2. **Use reverse proxy**: nginx or Apache in front of Node.js
3. **Enable HTTPS**: Use SSL/TLS certificates
4. **Firewall**: Only expose necessary ports
5. **Regular updates**: Keep dependencies updated

---

## 📁 Package Contents

```
bia-module/
├── .next/                    # Compiled production build (REQUIRED)
├── public/                   # Static assets
├── node_modules/             # Dependencies (install via npm)
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
└── PRODUCTION_DEPLOYMENT_GUIDE.md  # This file
```

---

## ✅ Post-Deployment Checklist

- [ ] Application starts without errors
- [ ] Can access http://localhost:3005
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] PM2/systemd service is running
- [ ] Application restarts automatically on failure
- [ ] Logs are being written correctly

---

## 📞 Support

For issues or questions, contact:
- **Development Team**: Parth Chauhan
- **Platform**: AutoBCM - Business Continuity Management

---

## 🎯 Quick Start Commands

```bash
# Extract and deploy
unzip autobcm-production-build.zip -d /opt/autobcm
cd /opt/autobcm/bia-module
npm ci --production
PORT=3005 pm2 start npm --name "autobcm" -- start
pm2 save
```

**That's it! Your AutoBCM platform is now running in production mode.** 🚀

