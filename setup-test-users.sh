#!/bin/bash

# Supabase configuration - replace with your actual values
SUPABASE_URL="https://xoeyjtsgbvufupkgsphn.supabase.co"
SERVICE_KEY="your-service-key-here"  # Replace with your actual service key

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Supabase Test User Setup Script ===${NC}"

# Function to make authenticated requests to Supabase
supabase_request() {
  local endpoint=$1
  local method=${2:-GET}
  local data=$3
  
  if [ "$method" = "GET" ]; then
    curl -s -H "Authorization: Bearer $SERVICE_KEY" \
         -H "apikey: $SERVICE_KEY" \
         "$SUPABASE_URL/$endpoint"
  else
    curl -s -X "$method" \
         -H "Authorization: Bearer $SERVICE_KEY" \
         -H "apikey: $SERVICE_KEY" \
         -H "Content-Type: application/json" \
         -d "$data" \
         "$SUPABASE_URL/$endpoint"
  fi
}

# Check if users exist
echo -e "\n${YELLOW}Checking existing users...${NC}"
users_response=$(supabase_request "rest/v1/users?email=in.(admin@com-psu-rizal.com,user1@com-psu-rizal.com,user2@com-psu-rizal.com)")

if [ "$users_response" = "[]" ] || [ -z "$users_response" ]; then
  echo -e "${YELLOW}No test users found. Creating test users...${NC}"
  
  # Create admin user auth record (this would typically be done through the auth API)
  echo -e "${BLUE}Note: You'll need to create auth users through the Supabase dashboard or auth API${NC}"
  echo -e "${BLUE}This script focuses on ensuring database records have correct roles${NC}"
else
  echo -e "${GREEN}Existing users found:${NC}"
  echo "$users_response" | jq '.[] | "Email: \(.email), Role: \(.role)"'
fi

# Check current roles and fix if needed
echo -e "\n${YELLOW}Verifying and fixing user roles...${NC}"

# Update admin user role
admin_update_response=$(supabase_request "rest/v1/users?email=eq.admin@com-psu-rizal.com" "PATCH" '{"role": "admin"}')
echo -e "${GREEN}Updated admin user role${NC}"

# Update student user roles
student1_update_response=$(supabase_request "rest/v1/users?email=eq.user1@com-psu-rizal.com" "PATCH" '{"role": "student"}')
student2_update_response=$(supabase_request "rest/v1/users?email=eq.user2@com-psu-rizal.com" "PATCH" '{"role": "student"}')
echo -e "${GREEN}Updated student user roles${NC}"

# Verify final state
echo -e "\n${YELLOW}Final user roles verification:${NC}"
final_response=$(supabase_request "rest/v1/users?email=in.(admin@com-psu-rizal.com,user1@com-psu-rizal.com,user2@com-psu-rizal.com)")
echo "$final_response" | jq '.[] | "Email: \(.email), Role: \(.role)"'

echo -e "\n${GREEN}=== Script completed ===${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Ensure auth users exist in Supabase Authentication dashboard"
echo -e "2. Test login with admin@com-psu-rizal.com (should go to admin dashboard)"
echo -e "3. Test login with user1@com-psu-rizal.com or user2@com-psu-rizal.com (should go to student dashboard)"