# MRP Frontend - cPanel Deployment Guide

## Build Status
✅ **Production Build Successful** - All TypeScript, ESLint, and Next.js checks passed.

## Build Artifacts
- **Location**: `/home/rehack/mrp_frontend/.next/`
- **Build ID**: Stored in `.next/BUILD_ID`
- **Production Ready**: Yes

## Prerequisites for cPanel Deployment

### 1. Node.js Environment
- **Required Version**: Node.js 18.17+ (Recommended: 20.x LTS)
- **Package Manager**: npm 9+ or yarn 3+

### 2. Environment Variables
Create `.env.production` or set via cPanel environment settings:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
```

### 3. Deployment Requirements
- **Disk Space**: ~500MB minimum for node_modules + .next build
- **Memory**: 512MB minimum recommended for Node.js runtime
- **Port**: Configure to use high-numbered port (e.g., 3000, 3001, 8080) with reverse proxy

## cPanel Deployment Steps

### Step 1: Upload Application
```bash
# Option A: Via cPanel File Manager
1. Upload entire app directory to public_html or a subdirectory
2. Exclude: node_modules, .git, .next/dev (keep .next/build, .next/server)

# Option B: Via SSH (Recommended)
scp -r /home/rehack/mrp_frontend user@cpanel-server:/home/user/public_html/mrp_frontend
```

### Step 2: Install Dependencies
```bash
cd /home/user/public_html/mrp_frontend
npm install --production

# Or with specific Node version manager (if using nvm)
nvm use 20
npm install --production
```

### Step 3: Configure Reverse Proxy

#### For Apache (with mod_proxy):
Create/update `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

#### For Nginx (if available):
Configure server block:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 4: Set Up Process Manager

#### Option A: PM2 (Recommended)
```bash
npm install -g pm2
pm2 start npm --name "mrp-frontend" -- start
pm2 save
pm2 startup
```

#### Option B: Node Process via cPanel
1. Go to cPanel > Setup Node.js App
2. Select Node.js version 20.x
3. Set Application root to `/home/user/public_html/mrp_frontend`
4. Set Startup file to `npm start` or create `server.js`

### Step 5: SSL/TLS Configuration
1. Use cPanel AutoSSL or Let's Encrypt (via cPanel)
2. Force HTTPS redirect in `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Step 6: Database & API Connectivity
Ensure `.env.production` has correct API endpoints:
- NEXT_PUBLIC_API_URL should point to your backend API
- Verify API CORS settings allow requests from your domain

### Step 7: Verify Deployment
```bash
# Test application is running
curl http://localhost:3000

# Check logs
pm2 logs

# Verify environment variables
echo $NODE_ENV
```

## Post-Deployment Checklist

- [ ] Application loads without errors on yourdomain.com
- [ ] All API endpoints reachable from production domain
- [ ] Environment variables properly configured
- [ ] SSL/HTTPS working correctly
- [ ] No console errors in browser DevTools
- [ ] Payment gateways functional (Whop, Seller, NOWPayments, Bank Transfer)
- [ ] Admin dashboard accessible
- [ ] User authentication working
- [ ] Database connections established
- [ ] Error logging configured

## Performance Optimization

### 1. Enable Compression
In `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 2. Browser Caching
```apache
<IfModule mod_headers.c>
  Header set Cache-Control "max-age=31536000, public" ".jpg;.jpeg;.png;.gif;.css;.js"
</IfModule>
```

### 3. Image Optimization
Images are already optimized via Next.js Image component - no additional action needed.

## Monitoring & Maintenance

### Logs Location
- PM2: `~/.pm2/logs/`
- Application: Check PM2 real-time logs with `pm2 logs`

### Common Issues & Solutions

#### Issue: Port already in use
```bash
lsof -i :3000  # Find process on port 3000
kill -9 <PID>   # Kill the process
```

#### Issue: Out of memory
- Increase server resources or Node.js max heap: `NODE_OPTIONS=--max-old-space-size=1024`

#### Issue: API calls failing
- Verify `.env.production` has correct API_URL
- Check CORS headers in backend
- Verify firewall rules allow outbound connections

## Updating Application

When deploying updates:
```bash
cd /home/user/public_html/mrp_frontend
git pull origin main  # or your deployment branch
npm install
pm2 reload mrp-frontend  # Zero-downtime restart
```

## Rollback Procedure
```bash
git checkout <previous-commit-hash>
npm install
pm2 restart mrp-frontend
```

## Contact & Support
For deployment issues, check:
1. cPanel error logs: `/home/user/logs/`
2. PM2 logs: `pm2 logs`
3. Browser console for client-side errors
4. Backend API logs for connectivity issues
