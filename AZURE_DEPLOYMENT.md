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

### 3. Create App Service Plan (for backend)

```bash
# Create App Service Plan (B1 tier - $13/month)
az appservice plan create \
  --name piwc-backend-plan \
  --resource-group piwc-grandrapids-rg \
  --location eastus2 \
  --sku B1 \
  --is-linux

# For free tier (with limitations):
# az appservice plan create \
#   --name piwc-backend-plan \
#   --resource-group piwc-grandrapids-rg \
#   --location eastus2 \
#   --sku F1 \
#   --is-linux
```

**Pricing Tiers:**
- `F1` - Free (1GB RAM, 60 min/day CPU, good for testing)
- `B1` - Basic ($13/month, 1.75GB RAM, always-on)
- `S1` - Standard ($70/month, 1.75GB RAM, auto-scale)

### 4. Create Web App (backend)

```bash
# Create Web App for backend API
az webapp create \
  --resource-group piwc-grandrapids-rg \
  --plan piwc-backend-plan \
  --name piwcgr-api \
  --runtime "NODE:18-lts"

# Enable HTTPS only
az webapp update \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --https-only true
```

**Note:** App name must be globally unique. If `piwcgr-api` is taken, try `piwcgr-api-2025` or similar.

---

## Deploy Backend (App Service)

### Step 1: Configure Environment Variables

Set all required environment variables in Azure:

```bash
# Get your storage connection string first
STORAGE_CONN=$(az storage account show-connection-string \
  --name piwcgrimages \
  --resource-group piwc-grandrapids-rg \
  --output tsv)

# Configure app settings (environment variables)
az webapp config appsettings set \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    JWT_SECRET="your-super-secret-jwt-key-change-this-$(openssl rand -hex 16)" \
    GEMINI_API_KEY="your-gemini-api-key-here" \
    SMTP_SERVICE=gmail \
    SMTP_USER="piwcgrandrapids0@gmail.com" \
    SMTP_PASS="your-gmail-app-password" \
    CHURCH_EMAIL="piwcgrandrapids0@gmail.com" \
    CHURCH_PHONE="(616) 123-4567" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_CONTAINER_NAME="church-images" \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

**🔐 Security:** Replace placeholder values with your actual credentials!

### Step 2: Deploy Backend Code

**Option A: Deploy from Local Git**

```bash
# Navigate to backend directory
cd backend

# Initialize git if not already done
git init

# Configure deployment user (one-time setup)
az webapp deployment user set \
  --user-name piwcgr-deployer \
  --password "YourSecurePassword123!"

# Get git deployment URL
az webapp deployment source config-local-git \
  --name piwcgr-api \
  --resource-group piwc-grandrapids-rg \
  --query url \
  --output tsv

# Add Azure as git remote
git remote add azure <deployment-url-from-above>

# Deploy
git add .
git commit -m "Initial backend deployment"
git push azure main
```

**Option B: Deploy via ZIP**

```bash
# Navigate to backend directory
cd backend

# Install production dependencies
npm install --production

# Create deployment package
zip -r backend.zip . -x "*.git*" "node_modules/*" ".env"

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --src backend.zip

# Clean up
rm backend.zip
```

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
  "status": "healthy",
  "timestamp": "2025-11-11T..."
}
```

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

# Get deployment token for CI/CD
az staticwebapp secrets list \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --query "properties.apiKey" \
  --output tsv
```

### Step 3: Deploy Frontend

**Option A: Deploy via Azure CLI**

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy from build folder
cd frontend
swa deploy ./build \
  --deployment-token <token-from-step-2> \
  --env production
```

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

## Troubleshooting

### Backend Not Starting

**Check Logs:**
```bash
az webapp log tail --name piwcgr-api --resource-group piwc-grandrapids-rg
```

**Common Issues:**
- Missing environment variables → Check App Settings
- Port mismatch → Ensure `PORT=8080` in settings
- Dependencies not installed → Redeploy with `npm install`

### Frontend 404 Errors

**Fix routing:**
- Ensure `staticwebapp.config.json` is deployed
- Check navigationFallback configuration

### CORS Errors

**Update backend CORS:**
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://piwcgr-website.azurestaticapps.net',
    'https://www.piwcgrandrapids.org'
  ]
}));
```

Redeploy backend after changes.

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

**Last Updated**: November 11, 2025

