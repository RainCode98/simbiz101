# Vercel Deployment Guide for Prisma Projects

## 🚀 Quick Fix for Prisma Client Error

The error you encountered is common when deploying Next.js apps with Prisma to Vercel. Here's how to fix it:

### ✅ **Automatic Fix (Already Applied)**

I've already updated your project with the necessary fixes:

1. **Updated `package.json` build script:**
   ```json
   "build": "prisma generate && next build"
   ```

2. **Added postinstall script:**
   ```json
   "postinstall": "prisma generate"
   ```

3. **Created `vercel.json` configuration**

### 📋 **Deployment Steps**

#### 1. **Set Up Environment Variables in Vercel**
Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-app-name.vercel.app
```

#### 2. **Database Setup**
For production, you'll need a real database. Options:
- **Vercel Postgres** (recommended)
- **PlanetScale**
- **Supabase**
- **Railway**
- **Neon**

#### 3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 🔧 **Manual Fixes (If Needed)**

If the automatic fix doesn't work, try these:

#### Option 1: Update Build Command in Vercel Dashboard
1. Go to Vercel → Settings → Build & Development Settings
2. Set Build Command to: `npm run build`
3. Set Install Command to: `npm install`

#### Option 2: Add Prisma to Dev Dependencies
```json
"devDependencies": {
  "prisma": "^6.11.1"
}
```

#### Option 3: Force Prisma Generation
Add this to your `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common');
    }
    return config;
  },
};

module.exports = nextConfig;
```

### 🎯 **Best Practices**

1. **Always use a production database** - don't use SQLite in production
2. **Set up database migrations** for production:
   ```bash
   prisma migrate deploy
   ```
3. **Monitor your deployment** with Vercel Logs
4. **Use Vercel Postgres** for the best integration

### 🐛 **Troubleshooting**

#### Error: "Prisma Client is not configured"
- Check your `DATABASE_URL` environment variable
- Ensure `prisma generate` runs during build

#### Error: "Can't reach database server"
- Verify your database is accessible from Vercel
- Check database connection string format

#### Error: "Module not found: Can't resolve '@prisma/client'"
- Ensure `postinstall` script runs
- Check that `@prisma/client` is in dependencies

### 📁 **Files Modified**

- `package.json` - Updated build and postinstall scripts
- `vercel.json` - Added Vercel configuration
- `.env.example` - Added environment variable template

### 🎉 **After Deployment**

Once deployed, your app should:
- ✅ Generate Prisma Client automatically
- ✅ Connect to your production database
- ✅ Handle database migrations
- ✅ Serve your Next.js app without Prisma errors

---

**Need help?** Check the [Vercel + Prisma documentation](https://vercel.com/guides/deploying-a-nextjs-app-with-prisma-to-vercel) or the [Prisma deployment guide](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel).