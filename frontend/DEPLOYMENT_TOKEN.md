# Deployment Token Management

## ⚠️ Important: The Deployment Token is STATIC

The Azure Static Web Apps deployment token **does NOT change automatically**. You must save it securely after creating your Static Web App.

## Your Current Token

Your deployment token is:
```
check google doc
```

## How to Save the Token

### Option 1: Create .env.deployment File (Recommended)

1. Create a file named `.env.deployment` in the `frontend/` directory
2. Add the following content:
   ```
   AZURE_SWA_DEPLOYMENT_TOKEN=check google doc
   ```
3. This file is already in `.gitignore`, so it won't be committed to git

### Option 2: Use Environment Variable

```bash
export AZURE_SWA_DEPLOYMENT_TOKEN=check google doc
```

## How to Deploy

### Using the Deployment Script (Easiest)

```bash
cd frontend
./deploy.sh
```

The script will:
1. Check if the token is set (from `.env.deployment` or environment variable)
2. Build the frontend
3. Deploy to Azure Static Web Apps

### Manual Deployment

```bash
cd frontend

# Build
npm run build

# Deploy (using token from .env.deployment)
source .env.deployment
swa deploy ./build \
  --deployment-token "$AZURE_SWA_DEPLOYMENT_TOKEN" \
  --env production

# Or deploy with token directly
swa deploy ./build \
  --deployment-token "google doc" \
  --env production
```

## If You Lose the Token

You can retrieve it again using Azure CLI:

```bash
az staticwebapp secrets list \
  --name piwcgr-website \
  --resource-group piwc-grandrapids-rg \
  --query "properties.apiKey" \
  --output tsv
```

## Security Notes

- ✅ The token is already in `.gitignore` - it won't be committed to git
- ✅ Store it securely - treat it like a password
- ✅ Don't share it publicly or commit it to version control
- ✅ If compromised, you can regenerate it in the Azure Portal (Settings → Deployment tokens)

## Regenerating the Token (If Needed)

If your token is compromised, you can regenerate it:

1. Go to Azure Portal → Your Static Web App → Settings → Deployment tokens
2. Click "Regenerate" to create a new token
3. Update your `.env.deployment` file with the new token

