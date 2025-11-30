#!/bin/bash

# Check Azure App Service Configuration
# Shows current App Settings, CORS, and status

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="piwc-grandrapids-rg"
APP_NAME="piwcgr-api"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Azure App Service Configuration Check${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed.${NC}"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Please login...${NC}"
    az login
fi

# Check if app exists
if ! az webapp show --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" &> /dev/null; then
    echo -e "${RED}❌ App Service '$APP_NAME' not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ App Service found${NC}"
echo ""

# Get app status
echo -e "${YELLOW}📊 App Status:${NC}"
az webapp show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query "{State:state, Status:state, URL:defaultHostName, Location:location}" \
    --output table

echo ""

# Check App Settings
echo -e "${YELLOW}⚙️  Environment Variables (App Settings):${NC}"
echo ""
SETTINGS=$(az webapp config appsettings list \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --output json)

# Required settings
REQUIRED=(
    "NODE_ENV"
    "PORT"
    "JWT_SECRET"
    "GEMINI_API_KEY"
    "SMTP_SERVICE"
    "SMTP_USER"
    "SMTP_PASS"
    "AZURE_STORAGE_CONNECTION_STRING"
    "AZURE_STORAGE_CONTAINER_NAME"
)

echo "Checking required settings:"
echo ""

for setting in "${REQUIRED[@]}"; do
    VALUE=$(echo "$SETTINGS" | jq -r ".[] | select(.name == \"$setting\") | .value" 2>/dev/null)
    if [ -n "$VALUE" ] && [ "$VALUE" != "null" ]; then
        if [ "$setting" == "JWT_SECRET" ] || [ "$setting" == "SMTP_PASS" ] || [ "$setting" == "AZURE_STORAGE_CONNECTION_STRING" ]; then
            # Hide sensitive values
            MASKED=$(echo "$VALUE" | sed 's/./*/g' | head -c 20)
            echo -e "  ${GREEN}✓${NC} $setting = ${MASKED}... (hidden)"
        else
            echo -e "  ${GREEN}✓${NC} $setting = $VALUE"
        fi
    else
        echo -e "  ${RED}✗${NC} $setting = ${YELLOW}MISSING${NC}"
    fi
done

echo ""

# Check CORS
echo -e "${YELLOW}🌐 CORS Configuration:${NC}"
echo ""
CORS_ORIGINS=$(az webapp cors show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query "allowedOrigins" \
    --output json 2>/dev/null)

if [ -n "$CORS_ORIGINS" ] && [ "$CORS_ORIGINS" != "null" ]; then
    echo "Allowed Origins:"
    echo "$CORS_ORIGINS" | jq -r '.[]' 2>/dev/null | while read origin; do
        if [[ "$origin" == *"piwcgrandrapids.com"* ]]; then
            echo -e "  ${GREEN}✓${NC} $origin"
        else
            echo -e "  ${GREEN}✓${NC} $origin"
        fi
    done
else
    echo -e "  ${RED}✗${NC} No CORS origins configured"
fi

echo ""

# Check if new domain is in CORS
if echo "$CORS_ORIGINS" | grep -q "www.piwcgrandrapids.com"; then
    echo -e "${GREEN}✅ New domain (www.piwcgrandrapids.com) is in CORS${NC}"
else
    echo -e "${YELLOW}⚠️  New domain (www.piwcgrandrapids.com) NOT in CORS${NC}"
    echo "   Run: ./deploy.sh cors   # updates origins + restarts"
fi

echo ""

# General settings
echo -e "${YELLOW}🔧 General Settings:${NC}"
echo ""
ALWAYS_ON=$(az webapp config show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query "alwaysOn" \
    --output tsv 2>/dev/null)

HTTPS_ONLY=$(az webapp config show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query "httpsOnly" \
    --output tsv 2>/dev/null)

if [ "$ALWAYS_ON" == "true" ]; then
    echo -e "  ${GREEN}✓${NC} Always On: Enabled"
else
    echo -e "  ${YELLOW}⚠${NC}  Always On: Disabled (recommended: Enabled for B1+ tier)"
fi

if [ "$HTTPS_ONLY" == "true" ]; then
    echo -e "  ${GREEN}✓${NC} HTTPS Only: Enabled"
else
    echo -e "  ${YELLOW}⚠${NC}  HTTPS Only: Disabled (recommended: Enabled)"
fi

echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 Summary:${NC}"
echo ""
echo "To view all settings in Azure Portal:"
echo "  https://portal.azure.com → Resource Groups → $RESOURCE_GROUP → $APP_NAME → Configuration"
echo ""
echo "To refresh CORS origins:"
echo "  ./deploy.sh cors"
echo ""
echo "To add missing environment variables:"
echo "  Azure Portal → Configuration → Application settings"
echo "  OR use: az webapp config appsettings set ..."
echo ""

