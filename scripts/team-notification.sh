#!/bin/bash

# TPDP Team Notification Script
# Enterprise Architecture Project Management

set -e

# Configuration
PROJECT_NAME="TPDP"
BRANCH_NAME=$(git branch --show-current)
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=format:'%s')
GITHUB_REPO="https://github.com/archdtech/TPDP"
BACKUP_REPO="https://github.com/archdtech/TPDPBackup-20250925"
TEAM_EMAIL="team@company.com"
SECURITY_EMAIL="security-urgent@company.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    echo -e "${GREEN}[NOTIFY]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

warn() {
    echo -e "${YELLOW}[NOTIFY]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

error() {
    echo -e "${RED}[NOTIFY]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Send email notification
send_email() {
    local subject=$1
    local body=$2
    local recipient=$3
    
    # Create email file
    cat > /tmp/email.txt << EOF
Subject: $subject
From: tpdp-automation@company.com
To: $recipient
Content-Type: text/html; charset=UTF-8

<html>
<body>
$2
</body>
</html>
EOF
    
    # Send email (using mail command or replace with your email service)
    if command -v mail &> /dev/null; then
        mail -s "$subject" -a "Content-Type: text/html" "$recipient" < /tmp/email.txt
        log "Email sent to $recipient"
    else
        warn "Email command not found. Please configure email service."
        log "Email content saved to /tmp/email.txt"
    fi
    
    rm -f /tmp/email.txt
}

# Create project kickoff notification
create_kickoff_notification() {
    local subject="🚨 URGENT: TPDP Security & Architecture Improvement Project - KICKOFF"
    
    local body=$(cat << 'EOF'
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">🚨 CRITICAL SECURITY PROJECT KICKOFF</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">TPDP Security & Architecture Improvement Project</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #856404; margin-top: 0;">⚠️ IMMEDIATE ATTENTION REQUIRED</h2>
            <p><strong>Priority:</strong> CRITICAL (Security Vulnerabilities)</p>
            <p><strong>Timeline:</strong> 6 weeks (Phased Approach)</p>
            <p><strong>Impact:</strong> Enterprise-wide security and operational improvements</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #495057; margin-top: 0;">📋 PROJECT OVERVIEW</h2>
            <p>A comprehensive security and architecture review has identified <strong>CRITICAL vulnerabilities</strong> in the TPDP project that require immediate attention.</p>
            
            <h3 style="color: #6c757d; margin-top: 20px;">🎯 PROJECT MISSION</h3>
            <p>Transform TPDP (Project Sentinel) into an enterprise-grade TPRM platform by implementing:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>🔒 Robust authentication and authorization system</li>
                <li>🏗️ Scalable multi-tenant architecture</li>
                <li>👥 Comprehensive admin functionality</li>
                <li>📊 Enterprise-grade security and compliance</li>
            </ul>
        </div>
        
        <div style="background: #fff; border: 2px solid #dee2e6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #495057; margin-top: 0;">🚨 CRITICAL SECURITY VULNERABILITIES</h2>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <h4 style="color: #721c24; margin-top: 0;">1. Basic Password Protection</h4>
                <p><strong>Issue:</strong> Using simple localStorage-based authentication</p>
                <p><strong>Risk:</strong> Account takeover, session hijacking</p>
                <p><strong>Impact:</strong> Complete system compromise</p>
            </div>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <h4 style="color: #721c24; margin-top: 0;">2. No Real Authentication System</h4>
                <p><strong>Issue:</strong> NextAuth.js installed but not implemented</p>
                <p><strong>Risk:</strong> No secure authentication mechanism</p>
                <p><strong>Impact:</strong> Unauthorized access to sensitive data</p>
            </div>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <h4 style="color: #721c24; margin-top: 0;">3. Insecure Session Management</h4>
                <p><strong>Issue:</strong> Client-side storage vulnerable to XSS attacks</p>
                <p><strong>Risk:</strong> Session theft, privilege escalation</p>
                <p><strong>Impact:</strong> Data breaches, compliance violations</p>
            </div>
        </div>
        
        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #004085; margin-top: 0;">📅 IMPLEMENTATION TIMELINE</h2>
            
            <div style="margin: 15px 0;">
                <div style="background: #dc3545; color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="margin: 0;">Phase 1: Security Foundation (Week 1-2) - CRITICAL</h4>
                    <p style="margin: 5px 0 0 0;">NextAuth.js implementation, secure sessions, password hashing</p>
                </div>
                
                <div style="background: #fd7e14; color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="margin: 0;">Phase 2: Database Architecture (Week 2-3) - HIGH</h4>
                    <p style="margin: 5px 0 0 0;">TPRM schema design, Prisma migrations, audit logging</p>
                </div>
                
                <div style="background: #fd7e14; color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="margin: 0;">Phase 3: Authorization System (Week 3-4) - HIGH</h4>
                    <p style="margin: 5px 0 0 0;">Server-side RBAC, permission management, security testing</p>
                </div>
                
                <div style="background: #ffc107; color: #212529; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="margin: 0;">Phase 4: Admin System (Week 4-5) - MEDIUM</h4>
                    <p style="margin: 5px 0 0 0;">Admin dashboard, user management, system monitoring</p>
                </div>
                
                <div style="background: #ffc107; color: #212529; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0;">Phase 5: Development Infrastructure (Week 5-6) - MEDIUM</h4>
                    <p style="margin: 5px 0 0 0;">Git workflow, CI/CD pipeline, team training</p>
                </div>
            </div>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #155724; margin-top: 0;">🎯 IMMEDIATE NEXT STEPS</h2>
            
            <h3 style="color: #155724; margin-top: 15px;">FOR ALL TEAM MEMBERS (TODAY)</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li><strong>📧 Read PROJECT_COMMUNICATION.md</strong> - Comprehensive project guidelines</li>
                <li><strong>🔄 Switch to feature branch</strong>: <code>git checkout feature/security-foundation-improvement</code></li>
                <li><strong>💬 Join communication channels</strong>: #tpdp-security-project</li>
                <li><strong>📅 Attend daily standup</strong>: 9:00 AM tomorrow</li>
                <li><strong>📋 Review assigned tasks</strong>: Check project board</li>
            </ol>
            
            <h3 style="color: #155724; margin-top: 15px;">FOR TEAM LEADS (TODAY)</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li><strong>👥 Assign team members to tasks</strong></li>
                <li><strong>📞 Set up 1:1 with team members</strong></li>
                <li><strong>🔧 Set up development environment</strong></li>
                <li><strong>📊 Create project tracking board</strong></li>
            </ol>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #495057; margin-top: 0;">📚 REPOSITORY INFORMATION</h2>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <h4 style="margin: 0;">Main Repository</h4>
                <p><strong>URL:</strong> <a href="$GITHUB_REPO" style="color: #007bff;">$GITHUB_REPO</a></p>
                <p><strong>Current Branch:</strong> feature/security-foundation-improvement</p>
                <p><strong>Latest Commit:</strong> $COMMIT_HASH</p>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <h4 style="margin: 0;">Backup Repository</h4>
                <p><strong>URL:</strong> <a href="$BACKUP_REPO" style="color: #007bff;">$BACKUP_REPO</a></p>
                <p><strong>Purpose:</strong> Baseline backup and restoration point</p>
            </div>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #856404; margin-top: 0;">🚨 EMERGENCY CONTACTS</h2>
            <p><strong>Security Incidents:</strong> $SECURITY_EMAIL</p>
            <p><strong>Project Questions:</strong> $TEAM_EMAIL</p>
            <p><strong>Technical Emergencies:</strong> Contact project lead directly</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">🚀 LET'S TRANSFORM TPDP INTO AN ENTERPRISE-GRADE TPRM PLATFORM!</h2>
            <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Your immediate attention and collaboration are crucial for project success.</p>
        </div>
    </div>
</body>
</html>
EOF
)
    
    send_email "$subject" "$body" "$TEAM_EMAIL"
}

# Create progress update notification
create_progress_notification() {
    local phase=$1
    local status=$2
    local progress=$3
    
    local subject="📊 TPDP Security Project - Phase $phase Update"
    
    local body=$(cat << EOF
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">📊 TPDP Security Project Update</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Phase $phase - $status</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #495057; margin-top: 0;">Progress Overview</h2>
            <div style="background: #e9ecef; height: 20px; border-radius: 10px; margin: 10px 0; overflow: hidden;">
                <div style="background: #28a745; height: 100%; width: $progress%; transition: width 0.3s ease;"></div>
            </div>
            <p style="text-align: center; margin: 10px 0 0 0; font-weight: bold;">$progress% Complete</p>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px;">
            <h2 style="color: #155724; margin-top: 0;">Recent Achievements</h2>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Project backup created and secured</li>
                <li>Git workflow established</li>
                <li>Communication plan documented</li>
                <li>Development guidelines created</li>
            </ul>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #856404; margin-top: 0;">Next Steps</h2>
            <p>Continue with Phase $phase implementation tasks as assigned.</p>
        </div>
    </div>
</body>
</html>
EOF
)
    
    send_email "$subject" "$body" "$TEAM_EMAIL"
}

# Create security alert notification
create_security_alert() {
    local alert_type=$1
    local description=$2
    local urgency=$3
    
    local subject="🚨 SECURITY ALERT: $alert_type"
    
    local body=$(cat << EOF
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: #dc3545; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">🚨 SECURITY ALERT</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">$alert_type - $urgency</p>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #721c24; margin-top: 0;">Alert Description</h2>
            <p>$description</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #856404; margin-top: 0;">Immediate Actions Required</h2>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li>Assess the security impact</li>
                <li>Implement immediate mitigation</li>
                <li>Notify security team</li>
                <li>Document the incident</li>
            </ol>
        </div>
    </div>
</body>
</html>
EOF
)
    
    send_email "$subject" "$body" "$SECURITY_EMAIL"
}

# Main execution
main() {
    case "$1" in
        "kickoff")
            log "Sending project kickoff notification"
            create_kickoff_notification
            ;;
        "progress")
            log "Sending progress update notification"
            create_progress_notification "$2" "$3" "$4"
            ;;
        "security")
            log "Sending security alert notification"
            create_security_alert "$2" "$3" "$4"
            ;;
        *)
            echo "Usage: $0 {kickoff|progress|security} [options]"
            echo "  kickoff                    Send project kickoff notification"
            echo "  progress <phase> <status> <progress>   Send progress update"
            echo "  security <type> <desc> <urgency>   Send security alert"
            exit 1
            ;;
    esac
}

main "$@"