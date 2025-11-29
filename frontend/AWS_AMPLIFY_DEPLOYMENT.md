# Deploy Frontend to AWS Amplify

## Why AWS Amplify?

Your Next.js app has API routes (`/app/api/*`), so you need a platform that supports server-side features. AWS Amplify is perfect for this and keeps everything on AWS.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Node.js 18+ installed

## Option 1: Deploy via AWS Console (Easiest)

### Step 1: Build Your Next.js App

```bash
cd frontend
npm install
npm run build
```

### Step 2: Create Amplify App

1. Go to **AWS Console → AWS Amplify**
2. Click **"New app" → "Host web app"**
3. Choose **"Deploy without Git provider"** (or connect GitHub if you prefer)
4. **App name**: `adray-frontend` (or your preferred name)
5. **Environment name**: `production`

### Step 3: Upload Build

1. Click **"Upload artifact"**
2. Create a ZIP file of your `frontend` folder:
   ```bash
   # From the frontend directory
   zip -r frontend-deploy.zip . -x "node_modules/*" ".next/*" ".git/*"
   ```
3. Upload the ZIP file

### Step 4: Configure Build Settings

Amplify will auto-detect Next.js, but you can customize:

**Build settings** (amplify.yml):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 5: Set Environment Variables

In Amplify Console → App settings → Environment variables:

```
NEXT_PUBLIC_API_URL=http://adrayapp-env.eba-v9aaqi26.eu-north-1.elasticbeanstalk.com
```

### Step 6: Deploy

Click **"Save and deploy"** - Amplify will build and deploy your app.

---

## Option 2: Deploy via AWS CLI

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify

```bash
cd frontend
amplify init
```

Follow the prompts:
- **Project name**: `adray-frontend`
- **Environment**: `production`
- **Default editor**: Your choice
- **App type**: `javascript`
- **Framework**: `react`
- **Source directory**: `.`
- **Build command**: `npm run build`
- **Start command**: `npm start`

### Step 3: Add Hosting

```bash
amplify add hosting
```

Choose:
- **Hosting with Amplify Console**
- **Manual deployment**

### Step 4: Publish

```bash
amplify publish
```

---

## Option 3: Static Export to S3 + CloudFront (Requires Code Changes)

If you want to use S3 + CloudFront, you need to:

1. **Remove Next.js API routes** (since you have a backend API)
2. **Configure static export** in `next.config.mjs`:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   ```
3. **Update API calls** to point directly to your backend
4. **Build and export**:
   ```bash
   npm run build
   # This creates an 'out' folder
   ```
5. **Upload to S3**:
   ```bash
   aws s3 sync out/ s3://your-bucket-name --delete
   ```
6. **Configure CloudFront** to serve from S3

**Note**: This requires refactoring your code to remove API routes.

---

## Recommended: AWS Amplify

Since you already have API routes and want to keep everything on AWS, **AWS Amplify is the best choice**. It:
- ✅ Supports Next.js API routes
- ✅ Handles SSR automatically
- ✅ Provides CDN (CloudFront) automatically
- ✅ Easy CI/CD with Git integration
- ✅ Free tier available

---

## After Deployment

1. **Update CORS** on your backend to allow your Amplify domain
2. **Test the health endpoint**: `https://your-amplify-domain.amplifyapp.com/health`
3. **Update frontend API URL** if needed

---

## Environment Variables

Make sure to set in Amplify Console:
- `NEXT_PUBLIC_API_URL` - Your Elastic Beanstalk backend URL

