#!/bin/bash

# TPDP Git Workflow Management Script
# Supports multiple developers with proper branching strategy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log() {
    echo -e "${GREEN}[GIT-WORKFLOW]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[GIT-WORKFLOW]${NC} $1"
}

error() {
    echo -e "${RED}[GIT-WORKFLOW]${NC} $1"
    exit 1
}

# Ensure we're in the project directory
cd "$PROJECT_DIR"

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository. Please run this script from the TPDP project directory."
    fi
}

# Function to check if remote exists
check_remote() {
    if ! git remote get-url origin > /dev/null 2>&1; then
        error "No remote 'origin' found. Please configure the remote repository."
    fi
}

# Function to setup proper branching structure
setup_branches() {
    log "Setting up proper branching structure..."
    
    # Fetch latest from remote
    git fetch origin
    
    # Check if develop branch exists on remote
    if git show-ref --verify --quiet refs/remotes/origin/develop; then
        log "Develop branch exists on remote"
    else
        warn "Develop branch not found on remote. Creating..."
        
        # Create develop branch from main
        git checkout main
        git pull origin main
        
        # Create and push develop branch
        git checkout -b develop
        git push -u origin develop
        
        log "Develop branch created and pushed to remote"
    fi
    
    # Switch back to feature branch if we were on it
    if [[ "$(git branch --show-current)" == "feature/security-foundation-improvement" ]]; then
        git checkout feature/security-foundation-improvement
    fi
    
    log "Branch structure setup complete"
}

# Function to create new feature branch
create_feature() {
    if [[ -z "$1" ]]; then
        error "Feature name required. Usage: $0 feature <feature-name>"
    fi
    
    local feature_name="feature/$1"
    
    log "Creating new feature branch: $feature_name"
    
    # Ensure we're on develop branch
    git checkout develop
    git pull origin develop
    
    # Create new feature branch
    git checkout -b "$feature_name"
    
    # Push to remote
    git push -u origin "$feature_name"
    
    log "Feature branch '$feature_name' created successfully"
    log "Use 'git workflow submit' when ready for review"
}

# Function to submit feature for review
submit_feature() {
    local current_branch=$(git branch --show-current)
    
    # Check if we're on a feature branch
    if [[ ! $current_branch =~ ^feature/ ]]; then
        error "Not on a feature branch. Please switch to a feature branch first."
    fi
    
    log "Submitting feature '$current_branch' for review..."
    
    # Ensure we're up to date
    git pull origin "$current_branch"
    
    # Create PR to develop branch
    local pr_title="feat: $(echo $current_branch | sed 's/^feature\///' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')"
    
    # Check if PR already exists
    if gh pr view --json title --jq '.title' 2>/dev/null | grep -q "$(echo $pr_title | cut -d' ' -f2-)"; then
        warn "PR already exists. Updating existing PR..."
        gh pr edit --title "$pr_title" --body "$(cat <<'EOF'
## 🎯 Feature Summary
$(echo $pr_title | cut -d' ' -f2-)

## 📋 Changes Made
- [ ] Security improvements implemented
- [ ] Code follows development guidelines
- [ ] Tests added/updated
- [ ] Documentation updated

## 🔒 Security Impact Assessment
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authorization checks added
- [ ] Security headers configured

## 🧪 Testing Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security tests pass
- [ ] Manual testing completed

## 📚 Documentation
- [ ] Code documented
- [ ] API documentation updated
- [ ] User documentation updated

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
    else
        # Create new PR
        gh pr create --title "$pr_title" --body "$(cat <<'EOF'
## 🎯 Feature Summary
$(echo $pr_title | cut -d' ' -f2-)

## 📋 Changes Made
- [ ] Security improvements implemented
- [ ] Code follows development guidelines
- [ ] Tests added/updated
- [ ] Documentation updated

## 🔒 Security Impact Assessment
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authorization checks added
- [ ] Security headers configured

## 🧪 Testing Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security tests pass
- [ ] Manual testing completed

## 📚 Documentation
- [ ] Code documented
- [ ] API documentation updated
- [ ] User documentation updated

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
    fi
    
    log "PR created/updated successfully"
    log "PR URL: $(gh pr view --json url --jq '.url')"
}

# Function to complete feature (merge to develop)
complete_feature() {
    local current_branch=$(git branch --show-current)
    
    # Check if we're on a feature branch
    if [[ ! $current_branch =~ ^feature/ ]]; then
        error "Not on a feature branch. Please switch to a feature branch first."
    fi
    
    log "Completing feature '$current_branch'..."
    
    # Ensure we're up to date
    git pull origin "$current_branch"
    
    # Switch to develop and update
    git checkout develop
    git pull origin develop
    
    # Merge feature branch
    git merge --no-ff "$current_branch" -m "feat: Merge $current_branch to develop

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Push to remote
    git push origin develop
    
    # Delete feature branch locally and remotely
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    log "Feature '$current_branch' completed successfully"
    log "Merged to develop branch and feature branch deleted"
}

# Function to create hotfix
create_hotfix() {
    if [[ -z "$1" ]]; then
        error "Hotfix name required. Usage: $0 hotfix <hotfix-name>"
    fi
    
    local hotfix_name="hotfix/$1"
    
    log "Creating hotfix branch: $hotfix_name"
    
    # Ensure we're on main branch
    git checkout main
    git pull origin main
    
    # Create new hotfix branch
    git checkout -b "$hotfix_name"
    
    # Push to remote
    git push -u origin "$hotfix_name"
    
    log "Hotfix branch '$hotfix_name' created successfully"
}

# Function to complete hotfix (merge to main and develop)
complete_hotfix() {
    local current_branch=$(git branch --show-current)
    
    # Check if we're on a hotfix branch
    if [[ ! $current_branch =~ ^hotfix/ ]]; then
        error "Not on a hotfix branch. Please switch to a hotfix branch first."
    fi
    
    log "Completing hotfix '$current_branch'..."
    
    # Ensure we're up to date
    git pull origin "$current_branch"
    
    # Merge to main first
    git checkout main
    git pull origin main
    git merge --no-ff "$current_branch" -m "hotfix: Merge $current_branch to main

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Push main to remote
    git push origin main
    
    # Merge to develop
    git checkout develop
    git pull origin develop
    git merge --no-ff "$current_branch" -m "hotfix: Merge $current_branch to develop

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Push develop to remote
    git push origin develop
    
    # Delete hotfix branch locally and remotely
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    log "Hotfix '$current_branch' completed successfully"
    log "Merged to main and develop branches"
}

# Function to release to production
release_production() {
    log "Releasing to production..."
    
    # Ensure we're on develop branch
    git checkout develop
    git pull origin develop
    
    # Create release branch
    local release_tag="release/$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$release_tag"
    
    # Push release branch
    git push origin "$release_tag"
    
    # Merge to main
    git checkout main
    git pull origin main
    git merge --no-ff "$release_tag" -m "release: Merge $release_tag to main

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Push main to remote
    git push origin main
    
    # Create tag
    local tag_name="v$(date +%Y%m%d).$(date +%H%M%S)"
    git tag -a "$tag_name" -m "Release $tag_name"
    git push origin "$tag_name"
    
    # Delete release branch locally and remotely
    git branch -d "$release_tag"
    git push origin --delete "$release_tag"
    
    log "Release completed successfully"
    log "Tag: $tag_name"
}

# Function to check project status
check_status() {
    log "=== TPDP Project Status ==="
    
    # Current branch
    local current_branch=$(git branch --show-current)
    log "Current branch: $current_branch"
    
    # Remote status
    log "Remote: $(git remote get-url origin)"
    
    # Branch status
    log ""
    log "=== Branch Status ==="
    git branch -a
    
    # Last commits
    log ""
    log "=== Recent Commits ==="
    git log --oneline -10
    
    # Uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        log ""
        log "=== Uncommitted Changes ==="
        git status --porcelain
    fi
    
    # PR status
    log ""
    log "=== Pull Request Status ==="
    if gh pr list --json title,author,state --jq '.[] | "\(.title) by \(.author) (\(.state))"' 2>/dev/null; then
        log "PRs found"
    else
        log "No open PRs"
    fi
}

# Function to run security checks
security_check() {
    log "Running security checks..."
    
    # Check for secrets
    log "Checking for secrets..."
    if command -v git-secrets >/dev/null 2>&1; then
        git secrets --scan
    else
        warn "git-secrets not installed. Skipping secret scan."
    fi
    
    # Check for vulnerabilities
    log "Checking for vulnerabilities..."
    if npm audit --audit-level moderate >/dev/null 2>&1; then
        log "✅ No vulnerabilities found"
    else
        warn "⚠️  Vulnerabilities found. Run 'npm audit' for details."
    fi
    
    # Run linting
    log "Running linting..."
    if npm run lint >/dev/null 2>&1; then
        log "✅ Linting passed"
    else
        warn "⚠️  Linting failed. Run 'npm run lint' for details."
    fi
    
    # Check for sensitive files
    log "Checking for sensitive files..."
    if git ls-files | grep -E '\.(env|key|pem|p12|jks)$' >/dev/null 2>&1; then
        warn "⚠️  Sensitive files found in repository"
        git ls-files | grep -E '\.(env|key|pem|p12|jks)$'
    else
        log "✅ No sensitive files found"
    fi
    
    log "Security checks completed"
}

# Main script logic
main() {
    check_git_repo
    check_remote
    
    case "$1" in
        "setup")
            setup_branches
            ;;
        "feature")
            create_feature "$2"
            ;;
        "submit")
            submit_feature
            ;;
        "complete")
            complete_feature
            ;;
        "hotfix")
            create_hotfix "$2"
            ;;
        "hotfix-complete")
            complete_hotfix
            ;;
        "release")
            release_production
            ;;
        "status")
            check_status
            ;;
        "security-check")
            security_check
            ;;
        *)
            echo "TPDP Git Workflow Management Script"
            echo ""
            echo "Usage:"
            echo "  $0 setup                          Setup proper branching structure"
            echo "  $0 feature <name>                 Create new feature branch"
            echo "  $0 submit                         Submit feature for review"
            echo "  $0 complete                       Complete and merge feature"
            echo "  $0 hotfix <name>                  Create hotfix branch"
            echo "  $0 hotfix-complete               Complete hotfix"
            echo "  $0 release                        Release to production"
            echo "  $0 status                         Check project status"
            echo "  $0 security-check                 Run security checks"
            echo ""
            echo "Examples:"
            echo "  $0 feature authentication-improvement"
            echo "  $0 hotfix security-vulnerability-fix"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"