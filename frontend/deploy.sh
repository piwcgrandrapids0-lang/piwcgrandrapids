#!/bin/bash

# Azure Static Web Apps Deployment Script
# This script deploys the frontend to Azure Static Web Apps

# Load deployment token from environment variable or .env.deployment file
if [ -f .env.deployment ]; then
    source .env.deployment
fi

# Check if token is set
if [ -z "$AZURE_SWA_DEPLOYMENT_TOKEN" ]; then
    echo "Error: AZURE_SWA_DEPLOYMENT_TOKEN is not set"
    echo ""
    echo "Please either:"
    echo "1. Create a .env.deployment file with:"
    echo "   AZURE_SWA_DEPLOYMENT_TOKEN=your-token-here"
    echo ""
    echo "2. Or set it as an environment variable:"
    echo "   export AZURE_SWA_DEPLOYMENT_TOKEN=your-token-here"
    echo ""
    echo "To retrieve your token, run:"
    echo "   az staticwebapp secrets list --name piwcgr-website --resource-group piwc-grandrapids-rg --query 'properties.apiKey' --output tsv"
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Deploy to Azure
echo "Deploying to Azure Static Web Apps..."
swa deploy ./build \
  --deployment-token "$AZURE_SWA_DEPLOYMENT_TOKEN" \
  --env production

if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed!"
    exit 1
fi

