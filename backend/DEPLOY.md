# Backend Deployment Guide - ZIP Method

Quick guide to deploy the backend to Azure App Service using the ZIP deployment method.

## Prerequisites

1. **Azure CLI** installed and configured
   ```bash
   az --version  # Should show version 2.x or higher
   ```

2. **Logged in to Azure**
   ```bash
   az login
   az account show  # Verify you're using the correct subscription
   ```

3. **App Service already created**
   - Resource Group: `piwc-grandrapids-rg`
   - App Name: `piwcgr-api`
   - If not created, see `AZURE_DEPLOYMENT.md` for setup instructions

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

```bash
cd backend
./deploy.sh
```

The script will:
1. ✅ Verify Azure login and app service exists
2. ✅ Create a deployment package (excluding node_modules, .env, uploads, etc.)
3. ✅ Deploy to Azure using `az webapp deploy`
4. ✅ Test the health endpoint
5. ✅ Clean up temporary files

### Option 2: Manual Deployment

```bash
cd backend

# Create deployment package
zip -r backend-deploy.zip . \
  -x "*.git*" \
  -x "*.env*" \
  -x "node_modules/*" \
  -x "data/*" \
  -x "uploads/*" \
  -x "*.DS_Store" \
  -x "backend-deploy.zip"

# Deploy to Azure
az webapp deploy \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --src-path backend-deploy.zip \
  --type zip

# Clean up
rm backend-deploy.zip
```

## Protect Persistent Data

- The deployment scripts intentionally **exclude `backend/data/` and `uploads/`** so the live JSON files on Azure (sermons, events, gallery metadata, etc.) stay untouched and existing Azure Blob images remain valid.
- Anything that still points to `/uploads/...` will be cleaned up on startup. Always upload images through the Admin UI so they are stored in Azure Blob Storage.
- If the gallery metadata is ever wiped, log into the Admin Dashboard and use **Gallery → Sync from Azure** (or call `POST /api/gallery/sync-from-azure`) to rebuild `gallery.json` from every blob stored in the `gallery/` folder.

## Update CORS Configuration

After deployment, update CORS to include the new domain:

```bash
cd backend
# Deploy + refresh CORS in one step
./deploy.sh with-cors

# or refresh CORS only (no deploy)
./deploy.sh cors
```

Or manually:

```bash
# Add new domain to CORS
az webapp cors add \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --allowed-origins "https://www.piwcgrandrapids.com"

# Restart app
az webapp restart \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api
```

## Verify Deployment

```bash
# Get app URL
az webapp show \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --query defaultHostName \
  --output tsv

# Test health endpoint
curl https://piwcgr-api.azurewebsites.net/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## View Logs

```bash
# Stream logs in real-time
az webapp log tail \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api

# Download logs
az webapp log download \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --log-file logs.zip
```

## Troubleshooting

### Deployment Fails

1. **Check Azure login:**
   ```bash
   az account show
   ```

2. **Verify app service exists:**
   ```bash
   az webapp show --resource-group piwc-grandrapids-rg --name piwcgr-api
   ```

3. **Check app status:**
   ```bash
   az webapp show \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api \
     --query "{state:state, status:state}"
   ```

### App Not Starting

1. **Check logs:**
   ```bash
   az webapp log tail --resource-group piwc-grandrapids-rg --name piwcgr-api
   ```

2. **Verify environment variables:**
   ```bash
   az webapp config appsettings list \
     --resource-group piwc-grandrapids-rg \
     --name piwcgr-api \
     --output table
   ```

3. **Restart app:**
   ```bash
   az webapp restart --resource-group piwc-grandrapids-rg --name piwcgr-api
   ```

### CORS Errors

1. **Update CORS in Azure:**
   ```bash
   ./deploy.sh cors
   ```

2. **Verify CORS in code** (already updated in `server.js`):
   - Check that `https://www.piwcgrandrapids.com` is in the CORS origins array

3. **Restart app:**
   ```bash
   az webapp restart --resource-group piwc-grandrapids-rg --name piwcgr-api
   ```

## What Gets Deployed

✅ **Included:**
- All source code (`.js` files)
- `package.json` and `package-lock.json`
- Configuration files (`web.config`)

❌ **Excluded:**
- `node_modules/` (Azure installs dependencies automatically)
- `.env` files (use Azure App Settings instead)
- `uploads/` folder (use Azure Blob Storage)
- `backend/data/` (persists on Azure between deployments)
- `.git/` directory
- Temporary files

## Environment Variables

Make sure all required environment variables are set in Azure App Settings:

```bash
az webapp config appsettings set \
  --resource-group piwc-grandrapids-rg \
  --name piwcgr-api \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    JWT_SECRET="your-secret" \
    GEMINI_API_KEY="your-key" \
    SMTP_SERVICE=gmail \
    SMTP_USER="your-email" \
    SMTP_PASS="your-password" \
    AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
    AZURE_STORAGE_CONTAINER_NAME="church-images"
```

See `env.example.txt` for all required variables.

## Notes

- **Node.js Version:** Azure will use the version specified in `package.json` or the runtime set when creating the app
- **Port:** Azure uses port 8080 by default (set `PORT=8080` in App Settings)
- **Always On:** Enable for B1+ tier to prevent cold starts
- **Dependencies:** Azure automatically runs `npm install --production` after deployment

## Related Files

- `deploy.sh` - Main deployment script
- `AZURE_DEPLOYMENT.md` - Complete Azure setup guide
- `env.example.txt` - Environment variables template

