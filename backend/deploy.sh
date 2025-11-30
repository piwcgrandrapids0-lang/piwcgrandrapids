#!/bin/bash

# Unified backend maintenance script
#   ./deploy.sh            -> Deploy backend code (default)
#   ./deploy.sh with-cors  -> Deploy + refresh CORS + restart
#   ./deploy.sh cors       -> Refresh CORS only (with restart)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

RESOURCE_GROUP="piwc-grandrapids-rg"
APP_NAME="piwcgr-api"
ZIP_FILE="backend-deploy.zip"
ALLOWED_ORIGINS=(
  "https://www.piwcgrandrapids.com"
  "https://icy-beach-06a0b2a0f.3.azurestaticapps.net"
  "http://localhost:3000"
  "http://localhost:5001"
)

ACTION=${1:-deploy}
APP_URL=""

usage() {
  cat <<EOF
Usage: ./deploy.sh [command]

Commands:
  deploy        Deploy backend code (default)
  with-cors     Deploy, update CORS origins, restart, run health check
  cors          Update CORS origins only (also restarts the app)
EOF
}

ensure_cli() {
  if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed.${NC}"
    exit 1
  fi

  echo -e "${YELLOW}Checking Azure login status...${NC}"
  if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Opening browser...${NC}"
    az login
  fi

  local subscription
  subscription=$(az account show --query name -o tsv)
  echo -e "${GREEN}✓ Using Azure subscription: ${subscription}${NC}\n"
}

ensure_app() {
  echo -e "${YELLOW}Verifying App Service exists...${NC}"
  if ! az webapp show --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" &> /dev/null; then
    echo -e "${RED}❌ App Service '$APP_NAME' not found in resource group '$RESOURCE_GROUP'${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ App Service found${NC}\n"
}

cleanup_zip() {
  if [ -f "$ZIP_FILE" ]; then
    rm -f "$ZIP_FILE"
  fi
}

create_package() {
  cleanup_zip
  echo -e "${YELLOW}📦 Creating deployment package...${NC}"
  zip -r "$ZIP_FILE" . \
    -x "*.git*" \
    -x "*.env*" \
    -x "node_modules/*" \
    -x "data/*" \
    -x "uploads/*" \
    -x "*.DS_Store" \
    -x "$ZIP_FILE" \
    -x ".vscode/*" \
    -x "*.log" \
    -x ".idea/*"

  if [ ! -f "$ZIP_FILE" ]; then
    echo -e "${RED}❌ Failed to create deployment zip${NC}"
    exit 1
  fi

  ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
  echo -e "${GREEN}✓ Package created: $ZIP_FILE ($ZIP_SIZE)${NC}\n"
}

get_app_url() {
  if [ -z "$APP_URL" ]; then
    APP_URL=$(az webapp show \
      --resource-group "$RESOURCE_GROUP" \
      --name "$APP_NAME" \
      --query defaultHostName \
      --output tsv)
  fi
  echo "$APP_URL"
}

deploy_code() {
  echo -e "${GREEN}🚀 Starting deployment${NC}\n"
  create_package
  az webapp deploy \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --src-path "$ZIP_FILE" \
    --type zip
  echo -e "${GREEN}✅ Deployment successful${NC}\n"
  cleanup_zip
}

update_cors() {
  echo -e "${YELLOW}Updating Azure CORS configuration...${NC}"
  az webapp cors remove \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --allowed-origins "*" 2>/dev/null || true

  for origin in "${ALLOWED_ORIGINS[@]}"; do
    echo "  Adding: $origin"
    az webapp cors add \
      --resource-group "$RESOURCE_GROUP" \
      --name "$APP_NAME" \
      --allowed-origins "$origin" >/dev/null || true
  done

  echo -e "${GREEN}✓ CORS origins updated${NC}\n"
}

restart_app() {
  echo -e "${YELLOW}Restarting App Service...${NC}"
  az webapp restart \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" >/dev/null
  echo -e "${GREEN}✓ Restart complete${NC}\n"
}

health_check() {
  local url
  url=$(get_app_url)
  echo -e "${YELLOW}Testing health endpoint...${NC}"
  sleep 3
  if curl -s -f "https://${url}/api/health" > /dev/null; then
    echo -e "${GREEN}✓ Health check passed (${url})${NC}\n"
  else
    echo -e "${YELLOW}⚠ Health check failed (app may still be starting)${NC}"
    echo "Check logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
  fi
}

ensure_cli
ensure_app

case "$ACTION" in
  deploy)
    deploy_code
    health_check
    ;;
  with-cors)
    deploy_code
    update_cors
    restart_app
    health_check
    ;;
  cors)
    update_cors
    restart_app
    health_check
    ;;
  *)
    usage
    exit 1
    ;;
esac

echo -e "${GREEN}🎉 Done!${NC}"

