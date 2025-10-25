# 🔐 Complete Guide: Removing Sensitive Files from Git/GitHub

## 📋 Table of Contents

- [Prevention is Key](#prevention-is-key)
- [Detection: How to Know if You&#39;ve Exposed Secrets](#detection)
- [Removal Methods: From Simple to Complex](#removal-methods)
- [Troubleshooting Common Issues](#troubleshooting)
- [Best Practices &amp; Tools](#best-practices)
- [Emergency Response Checklist](#emergency-checklist)

---

## 🛡️ Prevention is Key

### 1. Create .gitignore BEFORE Adding Any Files

```bash
# Create .gitignore immediately after git init
touch .gitignore
```

**Essential .gitignore content:**

```gitignore
# Environment variables
.env
.env.*
.env.local
.env.production
.env.development
.env.test

# Private keys
*.pem
*.key
*.p12
*.cer
*.cert
*.crt
*.pfx

# Configuration with secrets
config/secrets.yml
config/database.yml
secrets.json
credentials.json

# IDE and system files
.vscode/
.idea/
.DS_Store
Thumbs.db

# AWS
.aws/credentials
.aws/config

# Google Cloud
gcloud-key.json
service-account-*.json

# Docker
docker-compose.override.yml
```

### 2. Use Git Hooks for Protection

**Create pre-commit hook:** `.git/hooks/pre-commit`

```bash
#!/bin/bash
# Prevent committing sensitive files

FORBIDDEN_FILES=(
    ".env"
    "*.pem"
    "*.key"
    "credentials.json"
    "secrets.yml"
)

for pattern in "${FORBIDDEN_FILES[@]}"; do
    if git diff --cached --name-only | grep -E "$pattern"; then
        echo "🚫 ERROR: Attempt to commit sensitive file matching pattern: $pattern"
        echo "Remove the file from staging: git reset HEAD <file>"
        exit 1
    fi
done

# Check for potential secrets in files
if git diff --cached | grep -E "(api[_-]?key|password|secret|token|pwd)" -i; then
    echo "⚠️  WARNING: Possible secret detected in commit"
    echo "Review your changes carefully!"
    read -p "Continue with commit? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

**Make it executable:**

```bash
chmod +x .git/hooks/pre-commit
```

### 3. Global Git Ignore

```bash
# Create global gitignore
touch ~/.gitignore_global

# Configure git to use it
git config --global core.excludesfile ~/.gitignore_global

# Add common sensitive patterns
echo ".env" >> ~/.gitignore_global
echo "*.pem" >> ~/.gitignore_global
echo "*.key" >> ~/.gitignore_global
```

---

## 🔍 Detection: How to Know if You've Exposed Secrets

### Check if File is Tracked

```bash
# Check if specific file is tracked
git ls-files | grep -E "\.env|\.pem|\.key"

# Check all ignored files that are still tracked
git ls-files -i --exclude-from=.gitignore

# Search commit history for sensitive files
git log --all --full-history -- "**/.env"
git log --all --full-history -- "**/*.pem"

# Search for exposed secrets in history
git grep -i "password\|api[_-]key\|secret\|token" $(git rev-list --all)
```

### GitHub Secret Scanning

Check GitHub Security tab for alerts about exposed secrets.

---

## 🧹 Removal Methods: From Simple to Complex

### Method 1: Simple Untrack (File Never Pushed)

**Use when:** File is only in local commits, never pushed to remote

```bash
# Remove from tracking
git rm --cached .env

# Add to gitignore
echo ".env" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "Remove .env from tracking"
```

### Method 2: Remove from Recent Commits (Not Pushed)

**Use when:** File is in recent local commits but not pushed

```bash
# Remove from last commit
git reset HEAD~1
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove sensitive file"

# Or interactive rebase for multiple commits
git rebase -i HEAD~3  # Change 3 to number of commits to review
# Mark commits with 'edit', then:
git rm --cached .env
git commit --amend
git rebase --continue
```

### Method 3: Filter-Branch (File Already Pushed)

**Use when:** File is in remote repository history

```bash
# Remove file from entire history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git gc --prune=now --aggressive

# Force push (⚠️ Warning: This rewrites history)
git push origin --force --all
git push origin --force --tags

# Clean up local refs
rm -rf .git/refs/original/
```

### Method 4: Filter-Repo (Better than Filter-Branch)

**Use when:** You need more control and better performance

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove specific file
git filter-repo --path .env --invert-paths

# Remove multiple files
git filter-repo --path .env --path credentials.json --invert-paths

# Remove files matching pattern
git filter-repo --path-glob '*.env' --invert-paths

# Force push
git push origin --force --all
```

### Method 5: BFG Repo-Cleaner (Easiest for Large Cleanup)

**Use when:** Multiple files or large files need removal

```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Clone mirror of repo
git clone --mirror https://github.com/username/repo.git

# Remove files
java -jar bfg-1.14.0.jar --delete-files .env repo.git
java -jar bfg-1.14.0.jar --delete-files "*.key" repo.git

# Remove text from files
echo "PASSWORD=mysecret" > passwords.txt
java -jar bfg-1.14.0.jar --replace-text passwords.txt repo.git

# Clean and push
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

### Method 6: Nuclear Option - Fresh Start

**Use when:** Repository is new or cleanup is too complex

```bash
# 1. Backup current state
cp -r .git .git.backup
git archive --format=tar HEAD > backup.tar

# 2. Remove sensitive files locally
rm .env
git rm --cached .env

# 3. Create new repo on GitHub (delete old one)

# 4. Reinitialize git
rm -rf .git
git init
echo ".env" >> .gitignore
git add .
git commit -m "Initial commit - cleaned"

# 5. Push to new repository
git remote add origin https://github.com/username/new-repo.git
git push -u origin main
```

### Method 7: Rewriting Specific Commits

**Use when:** You know exactly which commits contain sensitive data

```bash
# Find commits with sensitive files
git log --oneline -- .env

# Rewrite specific commit
git rebase -i <commit-hash>^
# Change 'pick' to 'edit' for target commit
git rm --cached .env
git commit --amend
git rebase --continue

# Force push
git push --force
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: File Still Visible After Adding to .gitignore

```bash
# Solution: File is already tracked
git rm --cached .env
git commit -m "Remove tracked .env"
```

### Issue 2: Permission Denied When Force Pushing

```bash
# Solution: Check branch protection rules
# Or use personal access token
git remote set-url origin https://TOKEN@github.com/username/repo.git
```

### Issue 3: Collaborators Have Old History

```bash
# They need to reset their local repos
git fetch --all
git reset --hard origin/main
git clean -fd
```

### Issue 4: File Keeps Coming Back

```bash
# Check all branches
git branch -a | while read branch; do
    echo "Checking $branch"
    git ls-tree -r "$branch" | grep ".env"
done

# Remove from all branches
git filter-branch --index-filter \
    'git rm --cached --ignore-unmatch .env' \
    --tag-name-filter cat -- --all
```

### Issue 5: Submodules Contain Sensitive Files

```bash
# Update submodules
git submodule foreach --recursive \
    'git rm --cached .env 2>/dev/null || true'
```

### Issue 6: Large File Removal

```bash
# Find large files in history
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  sed -n 's/^blob //p' |
  sort --numeric-sort --key=2 |
  tail -20

# Remove with BFG
java -jar bfg.jar --strip-blobs-bigger-than 100M repo.git
```

---

## 💡 Best Practices & Tools

### Environment Management Tools

```bash
# 1. direnv - Auto-load environment variables
brew install direnv
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# 2. dotenv - Load from .env file
npm install dotenv
```

### Secret Management Services

```yaml
# GitHub Actions Secrets
- name: Use Secret
  env:
    API_KEY: ${{ secrets.API_KEY }}

# Docker Secrets
version: '3.7'
services:
  app:
    secrets:
      - api_key

# Kubernetes Secrets
kubectl create secret generic api-key \
  --from-literal=key=YOUR_KEY
```

### Scanning Tools

```bash
# 1. TruffleHog - Find secrets in git history
pip install truffleHog
trufflehog --regex --entropy=False https://github.com/username/repo

# 2. git-secrets - Prevent committing secrets
brew install git-secrets
git secrets --install
git secrets --register-aws

# 3. Gitleaks - Detect secrets
brew install gitleaks
gitleaks detect --source . -v
```

### .env.example Template

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# API Keys
STRIPE_KEY=sk_test_...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# App Secrets
JWT_SECRET=generate-a-long-random-string
SESSION_SECRET=another-random-string

# Third Party
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🚨 Emergency Response Checklist

### Immediate Actions (First 5 Minutes)

- [ ] **STOP** - Don't push any more commits
- [ ] **REVOKE** - Immediately revoke/change ALL exposed credentials
- [ ] **ASSESS** - List all sensitive data that was exposed

### Credential Rotation Checklist

- [ ] Database passwords
- [ ] API keys (AWS, Google, Stripe, etc.)
- [ ] JWT secrets
- [ ] OAuth client secrets
- [ ] Encryption keys
- [ ] SSH keys
- [ ] Service account credentials
- [ ] Webhook secrets
- [ ] Admin passwords

### Cleanup Actions

- [ ] Remove files from Git history
- [ ] Force push cleaned history
- [ ] Delete GitHub caches
- [ ] Check and clean all branches
- [ ] Update .gitignore
- [ ] Add pre-commit hooks

### Follow-up Actions

- [ ] Notify team members
- [ ] Check access logs for suspicious activity
- [ ] Enable 2FA on all services
- [ ] Review and update security practices
- [ ] Document lessons learned
- [ ] Set up secret scanning alerts

### Communication Template

```markdown
## Security Notice: Credential Rotation

**What happened:** Sensitive credentials were accidentally exposed in our repository.

**When:** [Date/Time]

**What we did:**
1. Immediately rotated all affected credentials
2. Removed sensitive data from repository history
3. Implemented additional safeguards

**Action required:**
- Pull the latest changes: `git fetch --all && git reset --hard origin/main`
- Update your local .env file with new credentials
- Enable 2FA on your accounts

**Prevention measures implemented:**
- Added comprehensive .gitignore
- Installed pre-commit hooks
- Enabled GitHub secret scanning
```

---

## 📚 Additional Resources

- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- [Gitleaks](https://github.com/zricethezav/gitleaks)
- [git-secrets](https://github.com/awslabs/git-secrets)

---

## 🎯 Quick Decision Tree

```
Is the file only local (never pushed)?
├── YES → Use Method 1: Simple Untrack
└── NO → Has it been pushed to GitHub?
    ├── NO (only local commits) → Use Method 2: Remove from Recent Commits
    └── YES → How critical is the exposure?
        ├── CRITICAL (production secrets) → 
        │   ├── Rotate credentials IMMEDIATELY
        │   └── Use Method 5: BFG or Method 6: Nuclear Option
        └── MODERATE (development secrets) →
            ├── Rotate credentials
            └── Use Method 3: Filter-Branch or Method 4: Filter-Repo
```

---

**Remember:** The most important step is ALWAYS to rotate/change any exposed credentials immediately, regardless of which cleanup method you choose!
