# Azure Deployment Guide - PIWC Grand Rapids Website

Complete guide to deploy your church website to Microsoft Azure with:
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure App Service
- **Storage**: Azure Blob Storage for images

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Account Setup](#azure-account-setup)
3. [Create Azure Resources](#create-azure-resources)
4. [Deploy Backend (App Service)](#deploy-backend-app-service)
5. [Deploy Frontend (Static Web App)](#deploy-frontend-static-web-app)
6. [Configure Azure Blob Storage](#configure-azure-blob-storage)
7. [Environment Variables](#environment-variables)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Monitoring & Logs](#monitoring--logs)
10. [Cost Estimation](#cost-estimation)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

Install the following on your local machine:

1. **Azure CLI**
   ```bash
   # macOS
   brew install azure-cli
   
   # Windows
   # Download from: https://aka.ms/installazurecliwindows
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Node.js 18+**
   ```bash
   node --version  # Should be 18.x or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

### Azure Account

- Azure subscription (free trial available at https://azure.microsoft.com/free/)
- Credit card for verification (free tier available)

---

## Azure Account Setup

### Step 1: Login to Azure

```bash
# Login to your Azure account
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "Your-Subscription-Name"
```

### Step 2: Create Resource Group

A resource group holds all your Azure resources:

```bash
# Create resource group in East US 2 region
az group create \
  --name piwc-grandrapids-rg \
  --location eastus2

# Verify creation
az group show --name piwc-grandrapids-rg
```

**Available Regions:** `eastus`, `eastus2`, `westus2`, `centralus`, `westeurope`

---

## Create Azure Resources

### 1. Create Azure Storage Account (for images)

```bash
# Create storage account
az storage account create \
  --name piwcgrimages \
  --resource-group piwc-grandrapids-rg \
  --location eastus2 \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot

# Get connection string (save this!)
az storage account show-connection-string \
  --name piwcgrimages \
  --resource-group piwc-grandrapids-rg \
  --output tsv
```

**💾 Save the connection string** - you'll need it for environment variables!

### 2. Create Blob Container

```bash
# Create container for church images
az storage container create \
  --name church-images \
  --account-name piwcgrimages \
  --public-access blob
```

### 3. Register Microsoft.Web Provider (Required First Time)

```bash
# Register the Microsoft.Web provider (required for App Service)
az provider register --namespace Microsoft.Web

# Check registration status
az provider show -n Microsoft.Web --query "registrationState" -o tsv
# Wait until it shows "Registered" (may take 1-2 minutes)
```

**⚠️ Important:** If you're on a Free Trial subscription, you'll need to:
1. Upgrade to Pay-As-You-Go subscription (free, just requires payment method)
2. Request quota increase for App Service Plans via Azure Portal:
   - Go to Help + Support → Create support request
   - Issue type: Service and subscription limits (quotas)
   - Quota type: Function or Web App (Windows and Linux)
   - Request 1-2 instances for Free or Basic tier

### 4. Create App Service Plan (for backend)

```bash
# Create App Service Plan (B1 tier - $13/month, recommended for production)
az appservice plan create \
  --name piwc-backend-plan \
  --resource-group piwc-grandrapids-rg \
  --location eastus2 \
  --sku B1 \
  --is-linux

# For free tier (with limitations - 60 min/day CPU limit):
# az appservice plan create \
#   --name piwc-backend-plan \
#   --resource-group piwc-grandrapids-rg \
#   --location eastus2 \
#   --sku F1 \
#   --is-linux
```

**Pricing Tiers:**
- `F1` - Free (1GB RAM, 60 min/day CPU, **quota limits apply**)
- `B1` - Basic ($13/month, 1.75GB RAM, always-on, **recommended**)
- `S1` - Standard ($70/month, 1.75GB RAM, auto-scale)

### 5. Create Web App (backend)

```bash
# Create Web App for backend API (Node.js 20 LTS - latest available)
az webapp create \
  --resource-group piwc-grandrapids-rg \
  --plan piwc-backend-plan \
  --name piwcgr-api \
  --runtime "NODE:20-lts"

# Enable HTTPS only
az webapp update \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --https-only true

# Enable Always On (prevents cold starts, requires B1 or higher tier)
az webapp config set \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --always-on true

# Configure CORS to allow frontend requests
az webapp cors add \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --allowed-origins "https://icy-beach-06a0b2a0f.3.azurestaticapps.net"
# Replace with your actual Static Web App URL after deployment
```

**Note:** 
- App name must be globally unique. If `piwcgr-api` is taken, try `piwcgr-api-2025` or similar.
- Always On requires B1 tier or higher (not available on Free tier)
- CORS is also configured in code (see server.js), but Azure-level CORS provides additional security

---

## Deploy Backend (App Service)

### Step 1: Configure Environment Variables

Set all required environment variables in Azure. **Get your actual values from your local `.env` file**:

```bash
# Get your storage connection string first
STORAGE_CONN=$(az storage account show-connection-string \
  --name piwcgrimages \
  --resource-group piwc-grandrapids-rg \
  --output tsv)

# Configure app settings (environment variables)
# Replace placeholder values with your actual credentials from backend/.env
az webapp config appsettings set \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    JWT_SECRET="your-actual-jwt-secret-from-env-file" \
    GEMINI_API_KEY="your-actual-gemini-api-key" \
    SMTP_SERVICE=gmail \
    SMTP_USER="piwcgrandrapids0@gmail.com" \
    SMTP_PASS="your-actual-gmail-app-password" \
    CHURCH_EMAIL="piwcgrandrapids0@gmail.com" \
    CHURCH_PHONE="(616) 123-4567" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_CONTAINER_NAME="church-images"

# Verify environment variables were set
az webapp config appsettings list \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --output table
```

**🔐 Security Notes:**
- Replace all placeholder values with your actual credentials from `backend/.env`
- Never commit `.env` file to git (it's in `.gitignore`)
- Use `env.example.txt` as a template for your local `.env` file
- JWT_SECRET should be a strong random string (use `openssl rand -hex 32`)
- SMTP_PASS should be a Gmail App Password (16 characters, not your regular password)

### Step 2: Deploy Backend Code

**Recommended: Deploy via ZIP (az webapp deploy)**

```bash
# Navigate to backend directory
cd backend

# Create deployment package (exclude unnecessary files)
zip -r backend-deploy.zip . \
  -x "*.git*" \
  -x "*.env" \
  -x "node_modules/*" \
  -x "uploads/*" \
  -x "*.DS_Store" \
  -x "backend-deploy.zip"

# Deploy to Azure (modern method)
az webapp deploy \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --src-path backend-deploy.zip \
  --type zip

# Clean up
rm backend-deploy.zip
```

**Alternative: Deploy via Legacy ZIP Method**

```bash
# Navigate to backend directory
cd backend

# Create deployment package
zip -r backend.zip . -x "*.git*" "node_modules/*" ".env" "uploads/*"

# Deploy to Azure (legacy method - deprecated)
az webapp deployment source config-zip \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --src backend.zip

# Clean up
rm backend.zip
```

**Note:** 
- The `az webapp deploy` command is the recommended modern method
- Exclude `.env` file from deployment (environment variables are set via Azure App Settings)
- Exclude `node_modules` (Azure will install dependencies automatically)
- Exclude `uploads` folder (use Azure Blob Storage for production)

### Step 3: Verify Backend Deployment

```bash
# Get backend URL
az webapp show \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --query defaultHostName \
  --output tsv

# Test health endpoint
curl https://piwcgr-api.azurewebsites.net/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**Troubleshooting:**
- If you get 503/504 errors, check if Always On is enabled (requires B1+ tier)
- If you get CORS errors, verify CORS is configured in both Azure and server.js
- Check logs: `az webapp log tail --resource-group piwc-grandrapids-rg --name piwcgr-api`

---

## Deploy Frontend (Static Web App)

### Step 1: Build Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Update API URL for production
# Edit src/App.js or create .env.production:
echo "REACT_APP_API_URL=https://piwcgr-api.azurewebsites.net" > .env.production

# Build production bundle
npm run build
```

### Step 2: Create Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --location eastus2 \
  --sku Free

# Get deployment token for CLI deployment
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --query "properties.apiKey" \
  --output tsv)

echo "Deployment Token: $DEPLOYMENT_TOKEN"
echo ""
echo "⚠️  IMPORTANT: Save this token securely!"
echo "   This token is STATIC and does NOT change automatically."
echo "   You'll need it for every deployment."
echo ""
echo "   To save it, create frontend/.env.deployment:"
echo "   AZURE_SWA_DEPLOYMENT_TOKEN=$DEPLOYMENT_TOKEN"
echo ""
echo "   Or use the deployment script: frontend/deploy.sh"
```

### Step 3: Deploy Frontend

**Install Static Web Apps CLI (if not already installed)**

```bash
npm install -g @azure/static-web-apps-cli
```

**Deploy Frontend**

**Option 1: Using the Deployment Script (Recommended)**

```bash
# Navigate to frontend directory
cd frontend

# Create .env.deployment file with your token (first time only)
# Copy .env.deployment.example to .env.deployment and add your token
echo "AZURE_SWA_DEPLOYMENT_TOKEN=$DEPLOYMENT_TOKEN" > .env.deployment

# Make deploy script executable
chmod +x deploy.sh

# Deploy (script will build and deploy automatically)
./deploy.sh
```

**Option 2: Manual Deployment**

```bash
# Navigate to frontend directory
cd frontend

# Create production environment file
echo "REACT_APP_API_URL=https://piwcgr-api.azurewebsites.net" > .env.production

# Build production bundle
npm run build

# Deploy using SWA CLI
# Load token from .env.deployment if it exists
if [ -f .env.deployment ]; then
    source .env.deployment
    swa deploy ./build \
      --deployment-token "$AZURE_SWA_DEPLOYMENT_TOKEN" \
      --env production
else
    # Or use the token directly:
    swa deploy ./build \
      --deployment-token "your-token-here" \
      --env production
fi
```

**⚠️ Important Notes About the Deployment Token:**
- **The token is STATIC** - it does NOT change automatically
- **You MUST save it** after creating the Static Web App
- **Store it securely** in `frontend/.env.deployment` (already in `.gitignore`)
- **If you lose it**, retrieve it with:
  ```bash
  az staticwebapp secrets list \
    --name piwcgr-website \
    --resource-group piwc-grandrapids-rg \
    --query "properties.apiKey" \
    --output tsv
  ```
- The `.env.production` file configures the frontend to use your backend API URL
- Both `.env.deployment` and `.env.production` are in `.gitignore` (already configured)

**Option B: Deploy via GitHub Actions**

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          api_location: ""
          output_location: "build"
```

Add deployment token to GitHub Secrets:
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Value: Token from Step 2
5. Save

### Step 4: Verify Frontend Deployment

```bash
# Get frontend URL
az staticwebapp show \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --query "defaultHostname" \
  --output tsv

# Visit in browser
open https://$(az staticwebapp show --name piwcgr-website --resource-group piwc-grandrapids-rg --query "defaultHostname" --output tsv)
```

---

## Configure Azure Blob Storage

### Set Up CORS (for frontend image uploads)

```bash
az storage cors add \
  --account-name piwcgrimages \
  --services b \
  --methods GET POST PUT DELETE \
  --origins "https://piwcgr-website.azurestaticapps.net" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600
```

### Test Image Upload

1. Go to: https://piwcgr-website.azurestaticapps.net/login
2. Login with admin credentials
3. Navigate to Gallery
4. Upload an image
5. Check Azure Portal → Storage Account → Containers → church-images

---

## Environment Variables

### Backend Environment Variables

Set these in Azure App Service → Configuration → Application Settings:

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `8080` | Server port (Azure uses 8080) |
| `JWT_SECRET` | `your-secret-key` | JWT signing key |
| `GEMINI_API_KEY` | `AIza...` | Google Gemini API key |
| `SMTP_SERVICE` | `gmail` | Email service provider |
| `SMTP_USER` | `piwcgrandrapids0@gmail.com` | SMTP username |
| `SMTP_PASS` | `app-password` | Gmail app password |
| `CHURCH_EMAIL` | `piwcgrandrapids0@gmail.com` | Church email |
| `CHURCH_PHONE` | `(616) 123-4567` | Church phone |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpoints...` | Azure Storage connection |
| `AZURE_STORAGE_CONTAINER_NAME` | `church-images` | Blob container name |

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://piwcgr-api.azurewebsites.net
REACT_APP_ENV=production
```

**Note:** This file should be in `.gitignore` (already configured).

### Local Development Environment Files

**Backend `.env` File:**
1. Copy `backend/env.example.txt` to `backend/.env`
2. Fill in your actual values:
   - `JWT_SECRET` - Generate with: `openssl rand -hex 32`
   - `GEMINI_API_KEY` - Get from https://ai.google.dev/
   - `SMTP_PASS` - Gmail App Password (16 characters)
   - `AZURE_STORAGE_CONNECTION_STRING` - From Azure Portal
3. **DO NOT commit** `.env` to git (it's in `.gitignore`)

**Frontend `.env` File (for local development):**
```env
REACT_APP_API_URL=http://localhost:5001
```

**Gitignore Configuration:**
The following files are already in `.gitignore`:
- `backend/.env`
- `frontend/.env`
- `frontend/.env.production`
- `backend/uploads/`
- `backend/data/`

**Important:** Never commit sensitive credentials to git!

---

## Custom Domain Setup

### For Frontend (Static Web App)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --hostname www.piwcgrandrapids.org

# Get validation token
az staticwebapp hostname show \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --hostname www.piwcgrandrapids.org
```

**DNS Configuration:**

Add these records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `piwcgr-website.azurestaticapps.net` |
| TXT | www | Validation token from above |

### For Backend (App Service)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name piwcgr-api \
  --resource-group piwc-grandrapids-rg \
  --hostname api.piwcgrandrapids.org

# Enable HTTPS
az webapp config ssl bind \
  --name piwcgr-api \
  --resource-group piwc-grandrapids-rg \
  --certificate-thumbprint auto \
  --ssl-type SNI
```

**DNS Configuration:**

| Type | Name | Value |
|------|------|-------|
| CNAME | api | `piwcgr-api.azurewebsites.net` |

---

## Monitoring & Logs

### View Backend Logs

```bash
# Stream logs in real-time
az webapp log tail \
  --name piwcgr-api \
  --resource-group piwc-grandrapids-rg

# Download logs
az webapp log download \
  --name piwcgr-api \
  --resource-group piwc-grandrapids-rg \
  --log-file logs.zip
```

### View Frontend Logs

```bash
# View Static Web App logs
az staticwebapp show \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg
```

### Enable Application Insights (Optional)

```bash
# Create Application Insights
az monitor app-insights component create \
  --app piwcgr-insights \
  --location eastus2 \
  --resource-group piwc-grandrapids-rg

# Get instrumentation key
az monitor app-insights component show \
  --app piwcgr-insights \
  --resource-group piwc-grandrapids-rg \
  --query instrumentationKey \
  --output tsv

# Add to backend app settings
az webapp config appsettings set \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="<key-from-above>"
```

---

## Cost Estimation

### Monthly Costs (USD)

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **App Service Plan** | B1 | $13.14 | Backend hosting |
| **Static Web App** | Free | $0.00 | 100GB bandwidth/month |
| **Storage Account** | Standard_LRS | $0.05-$2 | ~10GB images |
| **Bandwidth** | Outbound | $0-$5 | First 100GB free |
| **Application Insights** | Optional | $0-$5 | First 5GB free |
| **Total** | | **~$15-$25/month** | |

### Cost Optimization Tips

1. **Use Free Tier for Testing:**
   ```bash
   az appservice plan create --sku F1  # Free tier
   ```

2. **Auto-shutdown for Dev:**
   ```bash
   az webapp config set --auto-heal-enabled true
   ```

3. **Monitor Usage:**
   ```bash
   az consumption usage list --output table
   ```

---

## Important Configuration Notes

### Image Storage (Azure Blob Storage)

**⚠️ CRITICAL: Images MUST be stored in Azure Blob Storage, NOT locally**

The backend is configured to upload all images to Azure Blob Storage. In production:
- ✅ Images are saved to Azure Blob Storage (`piwcgrimages` storage account)
- ❌ Local storage fallback is DISABLED in production
- ❌ Images saved locally will be LOST on redeployment

**Why?** When you redeploy the backend, the local `uploads/` directory is wiped out. Only images in Azure Blob Storage persist.

**Verification:**
- Check image URLs in the gallery - they should start with `https://piwcgrimages.blob.core.windows.net/`
- If you see URLs like `/uploads/gallery/...`, those are local paths and will be lost

**If images disappear after deployment:**
1. Check Azure Storage connection string is set: `AZURE_STORAGE_CONNECTION_STRING`
2. Check backend logs for Azure upload errors
3. Re-upload images through the admin panel (they'll be saved to Azure)

**If images disappear after deployment:**
1. Check Azure Storage connection string is set: `AZURE_STORAGE_CONNECTION_STRING`
2. Check backend logs for Azure upload errors
3. Use "Sync from Azure" button in Admin Gallery to recover images
4. Re-upload images through the admin panel (they'll be saved to Azure)

### Backend Configuration

**CORS Configuration:**
The backend has CORS configured in two places:
1. **Azure App Service Level** (via CLI):
   ```bash
   az webapp cors add \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api \
     --allowed-origins "https://your-static-web-app-url.azurestaticapps.net"
   ```

2. **Code Level** (in `server.js`):
   ```javascript
   app.use(cors({
     origin: [
       'https://your-static-web-app-url.azurestaticapps.net',
       'http://localhost:3000'
     ],
     credentials: true
   }));
   ```

**Always On:**
- Required for B1 tier or higher
- Prevents cold starts (app stays warm)
- Free tier doesn't support Always On
- Enable: `az webapp config set --always-on true`

**Node.js Runtime:**
- Azure App Service supports Node.js 20 LTS (latest)
- Node.js 18 LTS is also available
- Set via: `--runtime "NODE:20-lts"` when creating web app

### Frontend Configuration

**API URL Configuration:**
- Create `.env.production` file in `frontend/` directory
- Set: `REACT_APP_API_URL=https://piwcgr-api.azurewebsites.net`
- This file should be in `.gitignore`

**Axios Configuration:**
- All API calls use `src/config/axios.js`
- Base URL is set from `REACT_APP_API_URL` environment variable
- Automatically includes authentication tokens

**Image URLs:**
- **Uploaded images** (gallery, leadership photos): Stored in Azure Blob Storage
  - URLs: `https://piwcgrimages.blob.core.windows.net/church-images/...`
  - Images persist across deployments (stored in cloud)
- **Static images**: Use relative paths: `/assets/images/...`
- Helper functions in `Home.js` and `Leadership.js` handle URL conversion for uploaded images
- ⚠️ **Important**: Images saved locally (`/uploads/...`) will be LOST on redeployment

**Data Persistence:**
- The `backend/data/` directory is **excluded** from deployment to preserve data on Azure
- All data files persist between deployments:
  - `sermons.json` - Sermons and video URLs
  - `events.json` - Events
  - `messages.json` - Contact messages
  - `prayers.json` - Prayer requests
  - `gallery.json` - Gallery metadata
  - `content.json` - Website content
- Images are stored in Azure Blob Storage (permanent)
- Videos are YouTube URLs (stored in `sermons.json`)

### Features Implemented

**Read/Unread Messages:**
- Messages and prayer requests can be marked as read/unread
- Backend endpoints:
  - `PATCH /api/contact/messages/:id/read`
  - `PATCH /api/prayer-requests/:id/read`
- Frontend shows visual indicators and filter buttons

**Video Embedding:**
- YouTube URLs are automatically converted to embed format
- Supports: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/live/`, and embed URLs
- Uses YouTube oEmbed format with `feature=oembed` parameter
- Invalid URLs show placeholder with "Watch on YouTube" link
- Videos are stored as URLs in `sermons.json` (not video files)

**Social Media Links:**
- Configured in `backend/data/content.json`
- Footer and Contact page use same data source
- Links: Facebook, YouTube, Instagram

### Environment Variables

**Backend `.env` File:**
- **DO NOT commit** `.env` to git (already in `.gitignore`)
- Use `env.example.txt` as a template
- Copy to `.env` and fill in your actual values
- Required variables:
  - `JWT_SECRET` - Generate with: `openssl rand -hex 32`
  - `GEMINI_API_KEY` - Get from https://ai.google.dev/
  - `SMTP_PASS` - Gmail App Password (16 characters)
  - `AZURE_STORAGE_CONNECTION_STRING` - From Azure Portal

**Azure App Settings:**
- All environment variables must be set in Azure App Service
- Use: `az webapp config appsettings set`
- Set `PORT=8080` (Azure default)
- Set `NODE_ENV=production`

---

## Troubleshooting

### Backend Not Starting

**Check Status:**
```bash
az webapp show \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --query "{state:state, status:state}" \
  --output table
```

**Check Logs:**
```bash
az webapp log tail \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api
```

**Common Issues:**
1. **Quota Exceeded (Free Tier):**
   - Free tier has 60 min/day CPU limit
   - Solution: Upgrade to B1 tier or wait for quota reset
   ```bash
   az appservice plan update \
     --resource-group piwc-grandrapids-rg \
     --name piwc-backend-plan \
     --sku B1
   ```

2. **Missing environment variables:**
   - Check: `az webapp config appsettings list --resource-group piwc-grandrapids-rg --name piwcgr-api`
   - Ensure JWT_SECRET, GEMINI_API_KEY, SMTP credentials are set

3. **Port mismatch:**
   - Azure uses port 8080 by default
   - Set `PORT=8080` in App Settings

4. **Always On disabled (causes slow cold starts):**
   ```bash
   az webapp config set \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api \
     --always-on true
   ```

5. **App crashed:**
   - Restart: `az webapp restart --resource-group piwc-grandrapids-rg --name piwcgr-api`
   - Redeploy if needed

### Frontend 404 Errors

**Fix routing:**
- Ensure `staticwebapp.config.json` is deployed
- Check navigationFallback configuration

### CORS Errors

**Symptoms:** `Access-Control-Allow-Origin` errors in browser console

**Fix (Two Places):**

1. **Azure App Service Level:**
   ```bash
   az webapp cors add \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api \
     --allowed-origins "https://your-frontend-url.azurestaticapps.net"
   ```

2. **Code Level (server.js):**
   ```javascript
   app.use(cors({
     origin: [
       'https://your-frontend-url.azurestaticapps.net',
       'http://localhost:3000'
     ],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

3. **Restart backend:**
   ```bash
   az webapp restart \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api
   ```

**Verify CORS:**
```bash
az webapp cors show \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api
```

### Image Uploads Failing

**Check:**
1. Storage connection string is set
2. Container `church-images` exists
3. Container has public blob access
4. CORS is configured

**Test connection:**
```bash
az storage blob list \
  --account-name piwcgrimages \
  --container-name church-images \
  --output table
```

### Deployment Fails

**Clear cache and retry:**
```bash
az webapp deployment source delete \
  --name piwcgr-api \
  --resource-group piwc-grandrapids-rg

# Then redeploy
```

---

## Quick Deployment Commands

### Complete Deployment Script

Save as `deploy.sh`:

```bash
#!/bin/bash

# Variables
RG="piwc-grandrapids-rg"
LOCATION="eastus2"
STORAGE="piwcgrimages"
BACKEND="piwcgr-api"
FRONTEND="piwcgr-website"

# Login
az login

# Create resource group
az group create --name $RG --location $LOCATION

# Create storage
az storage account create --name $STORAGE --resource-group $RG --location $LOCATION --sku Standard_LRS
az storage container create --name church-images --account-name $STORAGE --public-access blob

# Create backend
az appservice plan create --name piwc-backend-plan --resource-group $RG --location $LOCATION --sku B1 --is-linux
az webapp create --resource-group $RG --plan piwc-backend-plan --name $BACKEND --runtime "NODE:18-lts"

# Deploy backend
cd backend
zip -r backend.zip . -x "*.git*" "node_modules/*" ".env"
az webapp deployment source config-zip --resource-group $RG --name $BACKEND --src backend.zip
rm backend.zip
cd ..

# Create and deploy frontend
az staticwebapp create --name $FRONTEND --resource-group $RG --location $LOCATION --sku Free
cd frontend
npm install
npm run build
# Manual deployment via portal or GitHub Actions
cd ..

echo "✅ Deployment complete!"
echo "Backend: https://$BACKEND.azurewebsites.net"
echo "Frontend: Check Azure Portal for URL"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Login works with admin credentials
- [ ] Image upload works
- [ ] Images display from Azure Blob Storage
- [ ] Contact form sends emails
- [ ] Chatbot responds correctly
- [ ] All pages load properly
- [ ] HTTPS is enforced
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring/logs are accessible
- [ ] Backup strategy in place

---

## Support & Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Azure CLI Reference**: https://docs.microsoft.com/cli/azure
- **Static Web Apps**: https://azure.microsoft.com/services/app-service/static/
- **App Service**: https://azure.microsoft.com/services/app-service/
- **Blob Storage**: https://docs.microsoft.com/azure/storage/blobs/

---

**Deployment Complete!** 🎉

The PIWC Grand Rapids website is now live on Azure with:
- ✅ Scalable backend API
- ✅ Fast static website hosting
- ✅ Cloud image storage
- ✅ HTTPS security
- ✅ Custom domain ready

**Last Updated**: November 21, 2025

