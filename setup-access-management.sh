#!/bin/bash

# Project Sentinel Access Management Setup Script
# Run this script to configure proper access management

set -e

echo "=== Project Sentinel Access Management Setup ==="

# Configuration variables
REPO_OWNER="archdtech"
REPO_NAME="TPDP"
TEAM_NAME="project-sentinel-devs"
ORGANIZATION="archdtech"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI is not installed. Please install it first: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub. Please run 'gh auth login' first."
    exit 1
fi

echo "Step 1: Making repository private..."
read -p "Make repository private? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh repo edit "$REPO_OWNER/$REPO_NAME" --visibility private
    print_status "Repository made private."
else
    print_warning "Repository visibility unchanged."
fi

echo "Step 2: Creating development team..."
if gh team create "$TEAM_NAME" --organization "$ORGANIZATION" --description "Project Sentinel Development Team" --privacy closed --notification-setting notifications_enabled 2>/dev/null; then
    print_status "Team '$TEAM_NAME' created successfully."
else
    print_warning "Team '$TEAM_NAME' already exists or creation failed."
fi

echo "Step 3: Adding repository to team..."
if gh team add-repo "$TEAM_NAME" --organization "$ORGANIZATION" --repo "$REPO_OWNER/$REPO_NAME" --role admin 2>/dev/null; then
    print_status "Repository added to team with admin access."
else
    print_warning "Repository may already be added to team or operation failed."
fi

echo "Step 4: Setting up branch protection..."
echo "Setting up main branch protection..."
gh api repos/"$REPO_OWNER/$REPO_NAME"/branches/main/protection -X PUT \
    -f required_status_checks='{"strict":true,"contexts":["ci/test"]}' \
    -f enforce_admins=true \
    -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
    -f restrict_pushes='{"apps":[],"users":[]}' \
    -f allow_force_pushes=false \
    -f allow_deletions=false 2>/dev/null || print_warning "Main branch protection setup may have failed."

echo "Step 5: Creating development branch..."
if git show-ref --verify --quiet refs/heads/develop; then
    print_status "Development branch already exists."
else
    git checkout -b develop 2>/dev/null || print_warning "Could not create development branch locally."
    git push origin develop 2>/dev/null || print_warning "Could not push development branch to remote."
    print_status "Development branch created and pushed."
fi

echo "Step 6: Setting up development branch protection..."
gh api repos/"$REPO_OWNER/$REPO_NAME"/branches/develop/protection -X PUT \
    -f required_status_checks='{"strict":false,"contexts":[]}' \
    -f enforce_admins=false \
    -f required_pull_request_reviews='{"required_approving_review_count":1}' \
    -f restrict_pushes='{"apps":[],"users":[]}' 2>/dev/null || print_warning "Develop branch protection setup may have failed."

echo "Step 7: Creating priority labels..."
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="priority:critical" -f color="d73a4a" -f description="Critical priority issue" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="priority:high" -f color="ff0000" -f description="High priority issue" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="priority:medium" -f color="ff9933" -f description="Medium priority issue" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="priority:low" -f color="84b6eb" -f description="Low priority issue" 2>/dev/null || true
print_status "Priority labels created."

echo "Step 8: Creating type labels..."
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="type:bug" -f color="d73a4a" -f description="Bug report" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="type:feature" -f color="1f883d" -f description="New feature request" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="type:documentation" -f color="0075ca" -f description="Documentation update" 2>/dev/null || true
gh api repos/"$REPO_OWNER/$REPO_NAME"/labels -X POST -f name="type:security" -f color="d73a4a" -f description="Security issue" 2>/dev/null || true
print_status "Type labels created."

echo "Step 9: Enabling security features..."
gh api repos/"$REPO_OWNER/$REPO_NAME" -X PATCH \
    -f security_and_analysis='{"advanced_security":{"status":"enabled"},"secret_scanning":{"status":"enabled"},"dependency_graph":{"status":"enabled"}}' 2>/dev/null || print_warning "Security features may not be enabled."

echo "Step 10: Setting up repository secrets..."
read -p "Enter ZAI_API_KEY (or press Enter to skip): " zai_key
if [ ! -z "$zai_key" ]; then
    gh secret set ZAI_API_KEY --body "$zai_key" --repo "$REPO_OWNER/$REPO_NAME"
    print_status "ZAI_API_KEY secret set."
fi

read -p "Enter DATABASE_URL (or press Enter to skip): " db_url
if [ ! -z "$db_url" ]; then
    gh secret set DATABASE_URL --body "$db_url" --repo "$REPO_OWNER/$REPO_NAME"
    print_status "DATABASE_URL secret set."
fi

read -p "Enter NEXTAUTH_SECRET (or press Enter to skip): " nextauth_secret
if [ ! -z "$nextauth_secret" ]; then
    gh secret set NEXTAUTH_SECRET --body "$nextauth_secret" --repo "$REPO_OWNER/$REPO_NAME"
    print_status "NEXTAUTH_SECRET secret set."
fi

gh secret set NEXTAUTH_URL --body "http://localhost:3000" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || print_warning "NEXTAUTH_URL secret may not be set."
print_status "NEXTAUTH_URL secret set."

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Add developers to the '$TEAM_NAME' team:"
echo "   gh team add-member '$TEAM_NAME' --organization '$ORGANIZATION' --user developer-username --role member"
echo ""
echo "2. Verify all settings:"
echo "   gh repo view '$REPO_OWNER/$REPO_NAME'"
echo "   gh team list '$TEAM_NAME' --organization '$ORGANIZATION'"
echo ""
echo "3. Test branch protection by trying to push directly to main."
echo ""
echo "4. Create your first feature branch:"
echo "   git checkout -b feature/your-feature-name"
echo ""
echo "Access management setup complete!"